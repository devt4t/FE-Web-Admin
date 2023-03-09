<template>
    <div>
        <formRequestHelp :show="dialogs.help.model" @close="() => dialogs.help.model = false"></formRequestHelp>
        <v-dialog
            v-model="showDialog" 
            max-width="1200"
            content-class="rounded-xl"
            scrollable
            persistent
        >
            <v-card class="orange">
                <v-card-title class="transparent white--text rounded-xl">
                    <p class="mb-0"><v-icon color="white">mdi-comment-text</v-icon> Form Request</p>
                    <v-icon small class="ml-1" color="white" @click="() => dialogs.help.model = true">mdi-help-circle</v-icon>
                    <v-divider color="white" class="mx-2"></v-divider>
                    <v-icon color="white" @click="() => showDialog = false">mdi-close-circle</v-icon>
                </v-card-title>
                <v-card-text>
                    <v-overlay v-if="loading.show" justify-center align-center>
                        <v-progress-circular
                            :size="80"
                            :width="7"
                            indeterminate
                            color="white"
                        >
                        </v-progress-circular>
                        <p class="mb-0 text-center mt-4">{{ loading.text || 'Loading...' }}</p>
                    </v-overlay>
                    <v-stepper vertical v-model="stepper.model" class="rounded-xl elevation-0">
                        <!-- step 1 -->
                        <v-stepper-step color="orange" :complete="stepper.model > 1" step="1">
                            <span v-if="stepper.model < 2">Select {{ landProgram == 'Petani' ? 'Farmer' : 'MoU' }} & Land</span>
                            <span v-else>
                                {{ stepper1TitleComplete }}
                            </span>
                        </v-stepper-step>
                        <v-stepper-content step="1" class="pt-0">
                            <v-row class="mt-2">
                                <!-- Program Year -->
                                <v-col cols="12" sm="12" md="6" lg="3">
                                    <v-autocomplete
                                        color="success"
                                        dense
                                        hide-details
                                        item-color="success"
                                        :items="$store.state.programYear.options"
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
                                <!-- Land Program -->
                                <v-col cols="12" sm="12" md="6" lg="3">
                                    <v-autocomplete
                                        color="success"
                                        dense
                                        hide-details
                                        item-color="success"
                                        :items="inputs.landProgram.items"
                                        :label="inputs.landProgram.label"
                                        :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                                        outlined
                                        rounded
                                        :rules="[(v) => !!v || 'Field is required']"
                                        v-model="inputs.landProgram.model"
                                        disabled
                                    ></v-autocomplete>
                                </v-col>
                                <!-- Nursery -->
                                <v-col cols="12" lg="4">
                                    <v-autocomplete
                                        dense
                                        color="success"
                                        item-color="success"
                                        outlined
                                        hide-details
                                        :menu-props="{ bottom: true, offsetY: true, rounded: 'xl', transition: 'slide-y-transition' }"
                                        rounded
                                        label="Nursery"
                                        class=""
                                        :items="inputs.nursery.items"
                                        v-model="inputs.nursery.model"
                                    ></v-autocomplete>
                                </v-col>
                                <!-- Distribution Date -->
                                <v-col cols="12" lg="4" class="">
                                    <v-menu v-model="inputs.distributionDate.datepicker.show" offset-x transition="slide-x-transition" rounded="xl">
                                        <template v-slot:activator="{ on, attrs }">
                                            <p class="mb-0"><strong>{{ inputs.distributionDate.label }}</strong></p>
                                            <v-btn 
                                                rounded class=""
                                                color="green white--text"
                                                v-bind="attrs"
                                                v-on="on"
                                            >
                                                {{ $store.getters.dateFormat(inputs.distributionDate.model, 'ddd, DD MMMM Y') }}
                                            </v-btn>
                                        </template>
                                        <div>
                                            <v-overlay :value="inputs.distributionDate.loading">
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
                                                v-model="inputs.distributionDate.model"
                                                min="2022-11-24"
                                                @input="() => {inputs.distributionDate.datepicker.show = false}"
                                                color="green"
                                                class="rounded-xl"
                                                :key="inputs.distributionDate.datepicker.key"
                                            ></v-date-picker>
                                        </div>
                                    </v-menu>
                                </v-col>
                            </v-row>
                            <v-row class="mt-2">
                                <!-- Management Unit -->
                                <v-col cols="12" lg="4">
                                    <v-autocomplete
                                        dense
                                        color="success"
                                        item-color="success"
                                        outlined
                                        hide-details
                                        :menu-props="{ bottom: true, offsetY: true, rounded: 'xl', transition: 'slide-y-transition' }"
                                        rounded
                                        class=""
                                        label="Management Unit"
                                        :loading="inputs.mu.loading"
                                        :items="inputs.mu.items"
                                        item-text="name"
                                        item-value="mu_no"
                                        v-model="inputs.mu.model"
                                        :disabled="disabledInputMU"
                                        @change="($event) => getFForPICT4T($event)"
                                    ></v-autocomplete>
                                </v-col>
                                <!-- Petani: FF -->
                                <v-col v-if="inputs.landProgram.model == 'Petani'" cols="12" lg="4">
                                    <v-autocomplete
                                        dense
                                        color="success"
                                        item-color="success"
                                        outlined
                                        hide-details
                                        :menu-props="{ bottom: true, offsetY: true, rounded: 'xl', transition: 'slide-y-transition' }"
                                        rounded
                                        class=""
                                        label="Field Facilitator"
                                        :loading="inputs.ff.loading"
                                        :items="inputs.ff.items"
                                        item-text="ff_name"
                                        item-value="ff_no"
                                        v-model="inputs.ff.model"
                                        :disabled="disabledInputFF"
                                        @change="($event) => getFarmerOrMOU($event)"
                                    ></v-autocomplete>
                                </v-col>
                                <!-- Umum: PIC T4T -->
                                <v-col v-else-if="inputs.landProgram.model == 'Umum'" cols="12" lg="4">
                                    <v-autocomplete
                                        dense
                                        color="success"
                                        item-color="success"
                                        outlined
                                        hide-details
                                        :menu-props="{ bottom: true, offsetY: true, rounded: 'xl', transition: 'slide-y-transition' }"
                                        rounded
                                        class=""
                                        label="PIC T4T"
                                        :loading="inputs.pic_t4t.loading"
                                        :items="inputs.pic_t4t.items"
                                        item-text="employee_name"
                                        item-value="employee_no"
                                        v-model="inputs.pic_t4t.model"
                                        :disabled="disabledInputFF"
                                        @change="($event) => getFarmerOrMOU($event)"
                                    ></v-autocomplete>
                                </v-col>
                                <!-- Petani: Farmer -->
                                <v-col v-if="inputs.landProgram.model == 'Petani'" cols="12" lg="4">
                                    <v-autocomplete
                                        dense
                                        color="success"
                                        item-color="success"
                                        outlined
                                        hide-details
                                        :menu-props="{ bottom: true, offsetY: true, rounded: 'xl', transition: 'slide-y-transition' }"
                                        rounded
                                        class=""
                                        label="Farmer"
                                        :loading="inputs.farmer.loading"
                                        :items="inputs.farmer.items"
                                        item-text="farmer_name"
                                        item-value="farmer_no"
                                        v-model="inputs.farmer.model"
                                        :disabled="disabledInputFarmer"
                                        @change="($event) => getLand($event)"
                                    >
                                        <template v-slot:item="data">
                                            <v-list-item-content>
                                            <v-list-item-title v-html="data.item.farmer_name"></v-list-item-title>
                                            <v-list-item-subtitle><v-avatar color="green white--text mr-1" size="20">{{ data.item.lahan_no.length }}</v-avatar>{{ data.item.lahan_no.toString() }}</v-list-item-subtitle>
                                            </v-list-item-content>
                                        </template>
                                    </v-autocomplete>
                                </v-col>
                                <!-- Umum: MOU -->
                                <v-col v-else-if="inputs.landProgram.model == 'Umum'" cols="12" lg="4">
                                    <v-autocomplete
                                        dense
                                        color="success"
                                        item-color="success"
                                        outlined
                                        hide-details
                                        :menu-props="{ bottom: true, offsetY: true, rounded: 'xl', transition: 'slide-y-transition' }"
                                        rounded
                                        class=""
                                        label="MOU No"
                                        :loading="inputs.mou.loading"
                                        :items="inputs.mou.items"
                                        item-text="mou_no"
                                        item-value="mou_no"
                                        v-model="inputs.mou.model"
                                        :disabled="disabledInputMOU"
                                        @change="($event) => getLand($event)"
                                    >
                                        <template v-slot:item="data">
                                            <v-list-item-content>
                                            <v-list-item-title v-html="data.item.mou_no"></v-list-item-title>
                                            <v-list-item-subtitle>{{ data.item.pic_lahan }}</v-list-item-subtitle>
                                            </v-list-item-content>
                                        </template>
                                    </v-autocomplete>
                                </v-col>
                            </v-row>
                            <v-card class="elevation-0 mt-3" v-if="inputs.land.items.length > 0">
                                <v-card-title data-aos="zoom-in" class="pb-0">
                                    <v-spacer class="mr-2"></v-spacer>
                                    <span class="grey--text text--darken-2">
                                        <v-icon class="mr-1">mdi-timeline-check</v-icon> {{ landProgram == 'Petani' ? 'Farmer' : 'MoU' }} Activities
                                    </span>
                                    <v-spacer class="ml-2"></v-spacer>
                                </v-card-title>
                                <v-card-text class="pb-0">
                                    <v-stepper alt-labels class="elevation-0" v-model="inputs.activitiesStep.model">
                                        <v-stepper-header class="">
                                            <v-stepper-step data-aos="zoom-in" data-aos-delay="0" color="green" step="x" :complete="inputs.activitiesStep.model >= 1" :rules="[() => inputs.activitiesStep.model < 1 ? false : true]" error-icon="mdi-close-circle"><small>Pendataan Lahan</small></v-stepper-step>
                                            <v-divider class=""></v-divider>
                                            <v-stepper-step v-if="landProgram == 'Petani'" data-aos="zoom-in" data-aos-delay="50" color="green" step="x" :complete="inputs.activitiesStep.model >= 2" :rules="[() => inputs.activitiesStep.model < 2 ? false : true]" error-icon="mdi-close-circle"><small>Sosialisasi Tanam</small></v-stepper-step>
                                            <v-divider v-if="landProgram == 'Petani'" class=""></v-divider>
                                            <v-stepper-step data-aos="zoom-in" data-aos-delay="100" color="green" step="x" :complete="inputs.activitiesStep.model >= 3" :rules="[() => inputs.activitiesStep.model < 3 ? false : true]" error-icon="mdi-close-circle"><small>Penilikan Lubang</small></v-stepper-step>
                                            <v-divider class=""></v-divider>
                                            <v-stepper-step data-aos="zoom-in" data-aos-delay="150" color="green" step="x" :complete="inputs.activitiesStep.model >= 4" :rules="[() => inputs.activitiesStep.model < 4 ? false : true]" error-icon="mdi-close-circle"><small>Print Label</small></v-stepper-step>
                                            <v-divider class=""></v-divider>
                                            <v-stepper-step data-aos="zoom-in" data-aos-delay="200" color="green" step="x" :complete="inputs.activitiesStep.model >= 5" :rules="[() => inputs.activitiesStep.model < 5 ? false : true]" error-icon="mdi-close-circle"><small>Load Bag</small></v-stepper-step>
                                            <v-divider class=""></v-divider>
                                            <v-stepper-step data-aos="zoom-in" data-aos-delay="250" color="green" step="x" :complete="inputs.activitiesStep.model >= 6" :rules="[() => inputs.activitiesStep.model < 6 ? false : true]" error-icon="mdi-close-circle"><small>Distribute Bag</small></v-stepper-step>
                                            <v-divider class=""></v-divider>
                                            <v-stepper-step data-aos="zoom-in" data-aos-delay="300" color="green" step="x" :complete="inputs.activitiesStep.model >= 7" :rules="[() => inputs.activitiesStep.model < 7 ? false : true]" error-icon="mdi-close-circle"><small>Realisasi Tanam</small></v-stepper-step>
                                        </v-stepper-header>
                                    </v-stepper>
                                </v-card-text>
                            </v-card>
                            <v-row class="my-1 mt-3 mx-0 align-center">
                                <v-chip :color="`${inputs.land.items.length > 0 ? 'green' : 'red'} white--text`"><v-icon class="mr-1">mdi-land-fields</v-icon> Land: {{ inputs.land.items.length }}</v-chip>
                                <v-divider class="mx-2"></v-divider>
                                <v-btn rounded outlined color="orange" :disabled="disabledNext1" @click="() => {stepper.model += 1;getSeedlingChangeData()}">Next <v-icon>mdi-chevron-right</v-icon></v-btn>
                            </v-row>
                        </v-stepper-content>
                        <!-- step 2 -->
                        <v-stepper-step color="orange" :complete="stepper.model > 2" step="2">
                            <span v-if="stepper.model < 3">Seedling Change</span>
                            <span v-else>
                                {{ stepper2TitleComplete }}
                            </span>
                        </v-stepper-step>
                        <v-stepper-content step="2" class="pt-0">
                            <div v-if="inputs.seedling.length > 0" >
                                <v-card v-for="(seed, seedIndex) in inputs.seedling" :key="seedIndex" class="elevation-0">
                                    <v-card-title style="font-size: 15px;"><v-avatar size="23" color="grey darken-2 white--text" class="mr-2">
                                        {{ seedIndex + 1 }}</v-avatar> {{ seed.lahan_no }}
                                        <v-divider class="ml-2"></v-divider>
                                    </v-card-title>
                                    <v-card-text>
                                        <v-row>
                                            <!-- original seedling -->
                                            <v-col cols="12" lg="6">
                                                <v-card class="rounded-xl" data-aos-delay="100">
                                                    <v-card-text class="pb-0 d-flex align-center">
                                                        <v-chip color="green white--text"><v-icon class="mr-1">mdi-pine-tree-box</v-icon> Original</v-chip>
                                                        <v-divider class="mx-2"></v-divider>
                                                        <v-chip color="green darken-2 white--text"><v-icon class="mr-1" small>mdi-sprout</v-icon> {{ $store.getters.numberFormat(getTotalTrees(seed.old)) }}</v-chip>
                                                    </v-card-text>
                                                    <v-card-text>
                                                        <v-simple-table>
                                                            <thead>
                                                                <tr>
                                                                    <th>No</th>
                                                                    <th>Tree</th>
                                                                    <th>Amount</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                <tr v-for="(tree, treeIndex) in seed.old" :key="treeIndex">
                                                                    <td>{{ treeIndex + 1 }}</td>
                                                                    <td>{{ tree.tree_name }}</td>
                                                                    <td><v-icon class="mr-1" small>mdi-sprout</v-icon>{{ $store.getters.numberFormat(tree.amount) }}</td>
                                                                </tr>
                                                            </tbody>
                                                        </v-simple-table>
                                                    </v-card-text>
                                                </v-card>
                                            </v-col>
                                            <!-- change seedling -->
                                            <v-col cols="12" lg="6">
                                                <v-hover v-slot="{hover}">
                                                    <v-card class="rounded-xl" data-aos-delay="200">
                                                        <v-card-text class="pb-0 d-flex align-center">
                                                            <v-chip color="orange white--text" class="pl-1"><v-icon class="mr-1">mdi-pencil-circle</v-icon> Change</v-chip>
                                                            <v-divider class="mx-2"></v-divider>
                                                            <v-chip color="orange darken-2 white--text"><v-icon class="mr-1" small>mdi-sprout</v-icon> {{ $store.getters.numberFormat(getTotalTrees(seed.new)) }}</v-chip>
                                                        </v-card-text>
                                                        <v-card-text>
                                                            <v-simple-table>
                                                                <thead>
                                                                    <tr>
                                                                        <th>No</th>
                                                                        <th>Tree</th>
                                                                        <th class="text-right">Amount</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    <tr v-for="(tree, treeIndex) in seed.new" :key="treeIndex">
                                                                        <td>{{ treeIndex + 1 }}</td>
                                                                        <td>{{ tree.tree_name }}</td>
                                                                        <td class="d-flex align-center justify-end" style="gap: 5px;">
                                                                            <v-text-field 
                                                                                hide-details
                                                                                dense
                                                                                outlined
                                                                                rounded
                                                                                color="orange"
                                                                                type="number"
                                                                                min="0"
                                                                                prepend-inner-icon="mdi-sprout"
                                                                                v-model="tree.amount"
                                                                                style="max-width: 150px;"
                                                                            ></v-text-field>
                                                                            <v-icon color="red" @click="() => deleteSeedling(tree, seed)">mdi-delete-circle</v-icon>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </v-simple-table>
                                                            <div class="d-flex align-center mt-2">
                                                                <v-divider class="mr-2"></v-divider>
                                                                <v-autocomplete
                                                                    hide-details
                                                                    rounded
                                                                    outlined
                                                                    dense
                                                                    :menu-props="{ bottom: true, offsetY: true, rounded: 'xl', transition: 'slide-y-transition' }"
                                                                    return-object
                                                                    color="orange"
                                                                    item-color="orange"
                                                                    label="Add New Seedling"
                                                                    item-text="tree_name"
                                                                    item-value="tree_code"
                                                                    :items="trees.items"
                                                                    v-model="trees.model"
                                                                    style="max-width: 225px;"
                                                                ></v-autocomplete>
                                                                <v-btn @click="() => {addNewSeedling(seed)}" :disabled="!trees.model" fab rounded color="orange white--text" x-small class="ml-2"><v-icon small>mdi-plus</v-icon></v-btn>
                                                            </div>
                                                        </v-card-text>
                                                    </v-card>
                                                </v-hover>
                                            </v-col>
                                        </v-row>
                                    </v-card-text>
                                </v-card>
                            </div>
                            <div v-else style="height: 350px;"></div>
                            <v-row class="my-1 mt-3 mx-0 align-center">
                                <v-btn rounded outlined color="orange" @click="() => stepper.model -= 1"><v-icon>mdi-chevron-left</v-icon> Back</v-btn>
                                <v-divider class="mx-2"></v-divider>
                                <v-btn rounded outlined color="orange" :disabled="disabledNext2" @click="() => {stepper.model += 1;}">Next <v-icon>mdi-chevron-right</v-icon></v-btn>
                            </v-row>
                        </v-stepper-content>
                        <!-- step 3 -->
                        <v-stepper-step color="orange" step="3">
                            Confirmation
                        </v-stepper-step>
                        <v-stepper-content step="3">
                            <v-row class="my-0">
                                <!-- Change Log  -->
                                <v-col cols="12" lg="6">
                                    <p style="font-size: 16px;"><v-icon>mdi-clipboard-list</v-icon> Change Log Database</p>
                                    <v-simple-table dense>
                                        <tbody>
                                            <tr>
                                                <td style="width: 15px;">1</td>
                                                <td>Merubah data bibit lahan</td>
                                            </tr>
                                            <tr>
                                                <td style="width: 15px;">2</td>
                                                <td>Merubah data bibit sosialisasi tanam</td>
                                            </tr>
                                            <tr>
                                                <td style="width: 15px;">3</td>
                                                <td>Merubah data bibit penilikan lubang</td>
                                            </tr>
                                            <tr>
                                                <td style="width: 15px;">4</td>
                                                <td>Mengganti data distribusi bibit</td>
                                            </tr>
                                            <tr>
                                                <td style="width: 15px;">5</td>
                                                <td>Menghapus data realisasi tanam</td>
                                            </tr>
                                        </tbody>
                                    </v-simple-table>
                                </v-col>
                                <!-- Nursery Log -->
                                <v-col cols="12" lg="6">
                                    <p style="font-size: 16px;"><v-icon>mdi-format-list-checks</v-icon> Data Confirmation</p>
                                    <v-simple-table dense>
                                        <tbody>
                                            <tr>
                                                <td style="width: 15px;">1</td>
                                                <td colspan="2">Harap diprint ulang data <b>{{ this.inputs.land.items.length }} lahan</b> dari <b>petani {{ this.inputs.farmer.model ? (this.inputs.farmer.items.find(farVal => farVal.farmer_no == this.inputs.farmer.model).farmer_name || '-') : '-' }}</b> yang berubah</td>
                                            </tr>
                                            <tr>
                                                <td style="width: 15px;">2</td>
                                                <td>Gunakan fitur di-scan + di-verifikasikan pada data distribusi? </td>
                                                <td><v-switch class="d-inline-block" label="No"></v-switch></td>
                                            </tr>
                                        </tbody>
                                    </v-simple-table>
                                </v-col>
                                <!-- Notes -->
                                <v-col cols="12">
                                    <v-textarea rounded outlined dense hide-details color="green" :label="inputs.notes.label" v-model="inputs.notes.model" rows="3" prepend-icon="mdi-note-edit"></v-textarea>
                                </v-col>
                            </v-row>
                            <v-row class="my-1 mt-2 mx-0 align-center">
                                <v-btn rounded outlined color="orange" @click="() => stepper.model -= 1"><v-icon>mdi-chevron-left</v-icon> Back</v-btn>
                                <v-divider color="white" class="mx-2"></v-divider>
                                <v-btn rounded color="orange white--text" @click="() => sendRequest"> Send Request <v-icon class="ml-1">mdi-send</v-icon></v-btn>
                            </v-row>
                        </v-stepper-content>
                    </v-stepper>

                    <v-snackbar
                        v-model="snackbar.show"
                        :color="snackbar.color"
                        :timeout="snackbar.timeout"
                        rounded="xl"
                        class="d-flex"
                    >
                        <div class="d-flex justify-between">
                            <p class="mb-0">
                                {{ snackbar.text }}
                            </p>
                            <v-spacer></v-spacer>
                            <v-icon small class="pl-1" @click="() => snackbar.show = false">mdi-close-circle</v-icon>
                        </div>
                    </v-snackbar>
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import axios from 'axios'
import formRequestHelp from './formRequestHelp'

export default {
    components: {
        formRequestHelp
    },
    props: {
        show: {
            type: Boolean,
            default: false
        },
        landProgram: {
            type: String,
            default: ''
        },
        programYear: {
            type: String|Number,
            default: ''
        }
    },
    data: () => ({
        alert: {
            type: 'info',
            message: 'Select Nursery',
        },
        dialogs: {
            help: {model: false}
        },
        inputs: {
            programYear: {
                label: 'Program Year',
                model: null,
                loading: false
            },
            landProgram: {
                label: 'Land Program',
                items: ['Petani', 'Umum'],
                model: ''
            },
            nursery: {
                model: '',
                items: ['Arjasari','Ciminyak','Kebumen','Pati']
            },
            distributionDate: {
                datepicker: {
                    show: false,
                    key: 1315432
                },
                label: 'Distribution Date',
                loading: false,
                model: ''
            },
            mu: {
                items: [],
                model: '',
                loading: false
            },
            ff: {
                items: [],
                model: '',
                loading: false
            },
            pic_t4t: {
                items: [],
                model: '',
                loading: false
            },
            farmer: {
                items: [],
                model: '',
                loading: false
            },
            mou: {
                items: [],
                model: '',
                loading: false
            },
            land: {
                items: [],
                model: '',
                loading: false
            },
            activitiesStep: {
                model: 0,
            },
            seedling: [],
            notes: {
                label: 'Reason Notes',
                model: ''
            }
        },
        loading: {
            show: false,
            text: ''
        },
        trees: {
            items: [],
            model: ''
        },
        settings: {
            prefixUrl: 'SeedlingChangeRequest/',
        },
        snackbar: {
            color: 'green',
            timeout: 5000,
            show: false,
            text: 'Alert!'
        },
        stepper: {
            model: 1
        }
    }),
    watch: {
        'inputs.nursery.model': {
            async handler(val) {
                if (val && this.inputs.distributionDate.model) {
                    await this.getMU()
                }
            }
        },
        'inputs.distributionDate.model': {
            async handler(val) {
                if (val && this.inputs.distributionDate.model) {
                    await this.getMU()
                }
            }
        }
    },
    computed: {
        showDialog: {
            get: function () {
                if (this.show == true) this.initialize() 
                return this.show
            },
            set: async function (val) {
                if (val == false) {
                    this.$emit('close', 'create')
                    this.resetData()
                } 
            }
        },
        // main stepper title
        stepper1TitleComplete() {
            let title = ''
            const lp = this.inputs.landProgram.model
            // get MU
            const mu = this.inputs.mu.items.find(muVal => muVal.mu_no == this.inputs.mu.model)
            if (mu) title += mu.name
            if (lp == 'Petani') {
                // get ff
                const ff = this.inputs.ff.items.find(ffVal => ffVal.ff_no == this.inputs.ff.model)
                if (ff) title += ` > ${ff.ff_name}`
                // get farmer
                const farmer = this.inputs.farmer.items.find(farVal => farVal.farmer_no == this.inputs.farmer.model)
                if (farmer) title += ` > ${farmer.farmer_name}`
            } else if (lp == 'Umum') {
                // get pic t4t
                const picT4t = this.inputs.pic_t4t.items.find(picVal => picVal.employee_no == this.inputs.pic_t4t.model)
                if (picT4t) title += ` > ${picT4t.employee_name}`
                // get mou
                const mou = this.inputs.mou.items.find(mouVal => mouVal.mou_no == this.inputs.mou.model)
                if (mou) title += ` > ${mou.pic_lahan} ~ ${mou.mou_no}`
            }

            title += ` > ${this.inputs.land.items.length} Lahan`
            return title
        },
        stepper2TitleComplete() {
            const seedling = this.inputs.seedling
            let totalOri = 0
            let totalNew = 0
            let newSeed = []
            seedling.forEach(seedl => {
                seedl.old.forEach(seed => {
                    totalOri += parseInt(seed.amount)
                })
                seedl.new.forEach((seed, seedIndex) => {
                    totalNew += parseInt(seed.amount)
                    const checkExist = seedl.old.find(seo => seo.tree_code === seed.tree_code)
                    if (!checkExist && seed.amount > 0 && newSeed.includes(seed.tree_code) == false) newSeed.push(seed.tree_code)
                    else if (!checkExist && seed.amount == 0) seedl.new.splice(seedIndex, 1)
                })
            })
            return `Total from ${totalOri} to ${totalNew} with ${newSeed.length} new seedling`
        },
        // disabled
        disabledInputMU() {
            let status = false
            if (!this.inputs.nursery.model || !this.inputs.distributionDate.model) status = true
            return status
        },
        disabledInputFF() {
            let status = false
            if (!this.inputs.nursery.model || !this.inputs.distributionDate.model) status = true
            if (!this.inputs.mu.model) status = true
            return status
        },
        disabledInputFarmer() {
            let status = false
            if (!this.inputs.nursery.model || !this.inputs.distributionDate.model) status = true
            if (!this.inputs.mu.model) status = true
            if (!this.inputs.ff.model) status = true
            return status
        },
        disabledInputMOU() {
            let status = false
            if (!this.inputs.nursery.model || !this.inputs.distributionDate.model) status = true
            if (!this.inputs.mu.model) status = true
            if (!this.inputs.pic_t4t.model) status = true
            return status
        },
        disabledInputLand() {
            let status = false
            if (!this.inputs.nursery.model || !this.inputs.distributionDate.model) status = true
            if (!this.inputs.mu.model) status = true
            if (!this.inputs.ff.model) status = true
            if (!this.inputs.farmer.model) status = true
            return status
        },
        disabledNext1() {
            let status = false
            if (!this.inputs.programYear.model) status = true
            if (!this.inputs.landProgram.model) status = true
            if (!this.inputs.nursery.model) status = true
            if (!this.inputs.distributionDate.model) status = true
            if (!this.inputs.mu.model) status = true
            if (this.inputs.landProgram.model == 'Petani') {
                if (!this.inputs.ff.model) status = true
                if (!this.inputs.farmer.model) status = true
            } else if (this.inputs.landProgram.model == 'Umum') {
                if (!this.inputs.pic_t4t.model) status = true
                if (!this.inputs.mou.model) status = true
            }
            if (this.inputs.land.items.length == 0) status = true
            if (this.inputs.activitiesStep.model < 3) status = true
            return status
        },
        disabledNext2() {
            return false
        }
    },
    async mounted() {
        // await this.initialize()
    },
    methods: {
        async initialize() {
            this.stepper.model = 1
            this.inputs.programYear.model = this.programYear || this.$store.state.programYear.model
            this.inputs.landProgram.model = this.landProgram || 'Petani'
            
            await this.getTesterData()
        },
        async getMU() {
            try {
                this.inputs.mu.loading = true
                this.inputs.mu.model = ''
                this.inputs.mu.items = []
                this.inputs.ff.model = ''
                this.inputs.ff.items = []
                this.inputs.pic_t4t.model = ''
                this.inputs.pic_t4t.items = []
                this.inputs.farmer.model = ''
                this.inputs.farmer.items = []
                this.inputs.mou.model = ''
                this.inputs.mou.items = []
                this.inputs.land.model = ''
                this.inputs.land.items = []
                const params = new URLSearchParams({
                    program_year: this.inputs.programYear.model,
                    land_program: this.inputs.landProgram.model,
                    nursery: this.inputs.nursery.model,
                    distribution_date: this.inputs.distributionDate.model
                })
                const urlName = this.$store.getters.getApiUrl(`${this.settings.prefixUrl}GetMU?${params}`)
                const data = await axios.get(urlName, this.$store.state.apiConfig).then(res => {return res.data})
                this.inputs.mu.items = data.list
            } catch (err) {
                this.sessionEnd(err)
                console.log(err)
            } finally {
                this.inputs.mu.loading = false
            }
        },
        async getFForPICT4T(mu_no) {
            try {
                if (mu_no) {
                    const py = this.inputs.programYear.model
                    const lp = this.inputs.landProgram.model
                    this.alert.message = 'Select FF'
                    this.inputs.ff.loading = true
                    this.inputs.ff.model = ''
                    this.inputs.ff.items = []
                    this.inputs.farmer.model = ''
                    this.inputs.farmer.items = []
                    this.inputs.pic_t4t.loading = true
                    this.inputs.pic_t4t.model = ''
                    this.inputs.pic_t4t.items = []
                    this.inputs.mou.model = ''
                    this.inputs.mou.items = []
                    this.inputs.land.model = ''
                    this.inputs.land.items = []
                    const params = new URLSearchParams({
                        program_year: py,
                        land_program: lp,
                        mu_no: mu_no,
                        distribution_date: this.inputs.distributionDate.model
                    })
                    const urlName = this.$store.getters.getApiUrl(`${this.settings.prefixUrl}GetFF?${params}`)
                    const data = await axios.get(urlName, this.$store.state.apiConfig).then(res => {return res.data})
                    if (lp == 'Petani') this.inputs.ff.items = data.list
                    else if (lp == 'Umum') this.inputs.pic_t4t.items = data.list
                }
            } catch (err) {
                this.sessionEnd(err)
                console.log(err)
            } finally {
                this.inputs.ff.loading = false
                this.inputs.pic_t4t.loading = false
            }
        },
        async getFarmerOrMOU(ff_no) {
            try {
                if (ff_no) {
                    const py = this.inputs.programYear.model
                    const lp = this.inputs.landProgram.model
                    this.inputs.farmer.loading = true
                    this.inputs.farmer.model = ''
                    this.inputs.farmer.items = []
                    this.inputs.mou.loading = true
                    this.inputs.mou.model = ''
                    this.inputs.mou.items = []
                    this.inputs.land.model = ''
                    this.inputs.land.items = []
                    const params = new URLSearchParams({
                        program_year: py,
                        land_program: lp,
                        ff_no: ff_no,
                        distribution_date: this.inputs.distributionDate.model
                    })
                    if (lp == 'Umum') {
                        await params.delete('ff_no')
                        await params.set('employee_no', this.inputs.pic_t4t.model)
                    }
                    const urlName = this.$store.getters.getApiUrl(`${this.settings.prefixUrl}GetFarmer?${params}`)
                    const data = await axios.get(urlName, this.$store.state.apiConfig).then(res => {return res.data})
                    if (lp == 'Petani') this.inputs.farmer.items = data.list
                    else if (lp == 'Umum') this.inputs.mou.items = data.list
                }
            } catch (err) {
                this.sessionEnd(err)
                console.log(err)
            } finally {
                this.inputs.farmer.loading = false
                this.inputs.mou.loading = false
            }
        },
        async getLand(farmer_no) {
            try {
                if (farmer_no) {
                    const py = this.inputs.programYear.model
                    const lp = this.inputs.landProgram.model
                    this.alert.message = 'Select Land'
                    this.loading.show = true
                    this.loading.text = 'Getting land data...'
                    this.inputs.land.model = ''
                    this.inputs.land.items = []
                    const params = new URLSearchParams({
                        program_year: py,
                        land_program: lp,
                        farmer_no: farmer_no,
                        distribution_date: this.inputs.distributionDate.model
                    })
                    if (lp == 'Umum') {
                        await params.delete('farmer_no')
                        await params.set('mou_no', this.inputs.mou.model)
                    }
                    const urlName = this.$store.getters.getApiUrl(`${this.settings.prefixUrl}GetLand?${params}`)
                    const data = await axios.get(urlName, this.$store.state.apiConfig).then(res => {return res.data})
                    if (data.activities.includes('Pendataan Lahan')) this.inputs.activitiesStep.model = 1
                    if (data.activities.includes('Sosialisasi Tanam')) this.inputs.activitiesStep.model = 2
                    if (data.activities.includes('Penilikan Lubang')) this.inputs.activitiesStep.model = 3
                    if (data.activities.includes('Print Label')) this.inputs.activitiesStep.model = 4
                    if (data.activities.includes('Load Bag')) this.inputs.activitiesStep.model = 5
                    if (data.activities.includes('Distribute Bag')) this.inputs.activitiesStep.model = 6
                    if (data.activities.includes('Realisasi Tanam')) this.inputs.activitiesStep.model = 7
                    this.inputs.land.items = data.list
                }
            } catch (err) {
                this.sessionEnd(err)
                console.log(err)
            } finally {
                this.loading.show = false
            }
        },
        async getLandDetail(lahan_no) {
            try {
                const params = new URLSearchParams({
                    lahan_no: lahan_no,
                    land_program: this.inputs.landProgram.model,
                    program_year: this.inputs.programYear.model
                })
                const urlName = this.$store.getters.getApiUrl(`${this.settings.prefixUrl}GetLandDetail?${params}`)
                const data = await axios.get(urlName, this.$store.state.apiConfig).then(res => {return res.data})
                return data.penlub_bibit
            } catch (err) {
                this.sessionEnd(err)
                console.log(err)
                return false
            }
        },
        async getTreesLocations(mu_no) {
            try {
                const params = new URLSearchParams({
                    mu_no: mu_no,
                })
                const urlName = this.$store.getters.getApiUrl(`${this.settings.prefixUrl}GetTreesPerMU?${params}`)
                const data = await axios.get(urlName, this.$store.state.apiConfig).then(res => {return res.data})
                return data
            } catch (err) {
                this.sessionEnd(err)
                console.log(err)
                return false
            }
        },
        async getSeedlingChangeData() {
            try {
                // get Land Detail
                this.inputs.seedling = []
                const land = this.inputs.land.items
                const landTotal = land.length
                let getCount = 0
                this.loading.show = true
                this.inputs.seedling = []
                if (landTotal > 0) {
                    for (let index = 0; index < (landTotal); index++) {
                        this.loading.text = `Getting land data (${getCount}/${landTotal})...`
                        let penlub_bibit = await this.getLandDetail(land[index].lahan_no)
                        this.inputs.seedling.push(Object.assign({}, {
                            lahan_no: land[index].lahan_no,
                            old: penlub_bibit,
                            new: JSON.parse(JSON.stringify(penlub_bibit))
                        }))
                        getCount += 1
                    }
                }
                // get trees data
                this.loading.text = 'Getting trees data...'
                const listTrees = await this.getTreesLocations(this.inputs.mu.model)
                this.trees.items = listTrees
            } catch(err) {
                this.sessionEnd(err)
                console.log(err)
            } finally {
                this.loading.show = false
                this.loading.text = 'Loading...'
            }
        },
        async sendRequest() {
            try {
                const lands = JSON.parse(JSON.stringify(this.inputs.seedling))
                let lahan_no = []
                let seedling = []
                for (let index = 0; index < lands.length; index++) {
                    const land = lands[index]
                    const seedsNew = land.new
                    const seedsOri = land.old
                    // set lahan_no
                    lahan_no.push(land.lahan_no)
                    // set seedling
                    await seedsNew.map(seed => {
                        // check & get origin amount
                        let seedOri = seedsOri.find(seo => seo.tree_code === seed.tree_code)
                        let oriAmount = 0
                        if (seedOri) oriAmount = seedOri.amount
                        // get new amount
                        const newAmount = seed.amount
                        // get seedling type
                        let type = 'same'
                        if (oriAmount == newAmount) type = 'same'
                        else type = 'change'
                        if (oriAmount == 0) type = 'new'
                        if (newAmount == 0) type = 'remove'
                         
                        const data = {
                            lahan_no: land.lahan_no,
                            type: type,
                            tree_code: seed.tree_code,
                            old_amount: oriAmount,
                            new_amount: newAmount
                        }
                        seedling.push(data)
                    })
                }
                lahan_no = lahan_no.toString()
                console.log(lahan_no)
            } catch (err) {
                this.sessionEnd(err)
                console.log(err)
                return false
            } finally {

            }
        },
        // utilities: add and delete new seedling
        async addNewSeedling(seed) {
            let seedlings = seed.new
            let tree = this.trees.model
            const checkExising = await seedlings.find(sed => sed.tree_code === tree.tree_code)
            if (checkExising) {
                this.snackbar.text = 'Already exist!'
                this.snackbar.color = 'red'
                this.snackbar.show = true
            } else {
                let data = {
                    tree_code: tree.tree_code,
                    tree_name: tree.tree_name,
                    tree_category: tree.tree_category,
                    amount: 0
                }
                seedlings.push(data)
            }
            this.trees.model = ''
        },
        async deleteSeedling(tree, seed) {
            try {
                const checkOrigin = seed.old.find(ol => ol.tree_code === tree.tree_code)
                if (checkOrigin) {
                    tree.amount = 0
                    this.snackbar.text = 'Seedling Cleared!'
                }
                else {
                    const treeIndex = seed.new.findIndex(ne => ne.tree_code === tree.tree_code)
                    seed.new.splice(treeIndex, 1)
                    this.snackbar.text = 'Seedling Deleted!'
                }
                this.snackbar.color = 'green'
            } catch {
                this.snackbar.text = 'Failed to delete!'
                this.snackbar.color = 'red'
            } finally {
                this.snackbar.show = true
            }
        },
        // Utilities: get sum bibit
        getTotalTrees(list) {
            try {
                if (list.length > 0) {
                    let sum = 0
                    list.forEach(tree => {
                        sum += parseInt(tree.amount)
                    })
                    return sum
                } else return 0
            } catch {
                return 0
            }
        },
        // Utilities: reset data
        resetData() {
            this.inputs.programYear.model = ''
            this.inputs.nursery.model = ''
            this.inputs.distributionDate.model = ''
            this.inputs.mu.model = ''
            this.inputs.ff.model = ''
            this.inputs.pic_t4t.model = ''
            this.inputs.farmer.model = ''
            this.inputs.mou.model = ''
            this.inputs.land.model = ''
            this.inputs.notes.model = ''
        },
        // Utilities: session  end
        sessionEnd(error) {
            if (error.response) {
                if (typeof error.response.status != 'undefined') {
                    if (error.response.status == 401) {
                        localStorage.removeItem("token")
                        this.$router.push("/")
                    }
                }
            }
        },
        // tester
        async getTesterData() {
            if (this.landProgram == 'Umum') {
                this.inputs.nursery.model = await 'Arjasari'
                this.inputs.distributionDate.model = await '2023-02-07'
                await this.getMU()
                this.inputs.mu.model = '022'
                await this.getFForPICT4T('022')
                this.inputs.pic_t4t.model = '04-0006'
                await this.getFarmerOrMOU('04-0006')
                this.inputs.mou.model = '112/T4T-U/CRS-I/XI/2022'
                await this.getLand('112/T4T-U/CRS-I/XI/2022')
                this.stepper.model = 2
                await this.getSeedlingChangeData()
                this.stepper.model = 3
            } else if (this.landProgram == 'Petani') {
                this.inputs.nursery.model = await 'Kebumen'
                this.inputs.distributionDate.model = await '2022-12-05'
                await this.getMU()
                this.inputs.mu.model = '019'
                await this.getFForPICT4T('019')
                this.inputs.ff.model = 'FF00000992'
                await this.getFarmerOrMOU('FF00000992')
                this.inputs.farmer.model = 'F00019831'
                await this.getLand('F00019831')
                this.stepper.model = 2
                await this.getSeedlingChangeData()
                this.inputs.seedling[0].new[0].amount = 0
                this.inputs.seedling[0].new[1].amount = 3
                this.inputs.seedling[0].new[3].amount = 23
                this.inputs.seedling[0].new.push({
                    tree_code: this.trees.items[0].tree_code,
                    tree_name: this.trees.items[0].tree_name,
                    amount: 9,
                })
                this.stepper.model = 3
            }
            await setTimeout(() => {
                this.inputs.notes.model = 'Tester change request...'
                this.sendRequest()
            }, 1000)
        }
    },
}
</script>