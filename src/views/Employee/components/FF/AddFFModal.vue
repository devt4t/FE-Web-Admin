<template>
    <!-- Modal Add Edit -->
    <v-dialog v-model="showModal" max-width="1000px" content-class="rounded-xl" scrollable>
    <v-card>
        <v-card-title class="ma-1 blue darken-2 rounded-xl">
            <v-icon color="white" class="mr-2">mdi-account-box</v-icon>
            <span class="white--text"> Field Facilitator Form</span>
            <v-divider color="white" class="mx-2"></v-divider>
            <v-icon color="white" @click="() => showModal = false">mdi-close-circle</v-icon>
        </v-card-title>
        <v-card-text>
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
            <div class="pb-2 d-flex align-center mt-4">
                <v-select
                    v-if="!this.id"
                    color="success"
                    item-color="success"
                    v-model="inputs.program_year.model"
                    :items="$store.state.programYear.options"
                    outlined
                    dense
                    hide-details
                    :menu-props="{ bottom: true, offsetY: true, rounded: 'xl', transition: 'slide-y-transition' }"
                    rounded
                    :label="inputs.program_year.label"
                    :placeholder="inputs.program_year.placeholder"
                    class="mx-auto mr-lg-2 mb-2 mb-lg-0"
                    style="max-width: 250px"
                >
                    <template v-slot:label>
                        <v-icon v-if="inputs.program_year.labelIcon" class="mr-1">{{ inputs.program_year.labelIcon }}</v-icon>
                        {{ inputs.program_year.label }} 
                        <sup><v-icon v-if="inputs.program_year.required" small style="vertical-align: middle;">{{ localConfig.requiredInputIcon }}</v-icon></sup>
                    </template>
                </v-select>
                <!-- Status -->
                <v-switch
                v-else
                    v-model="inputs.active.model"
                    :label="`Status FF : ${inputs.active.model ? 'Aktif' : 'Non-Aktif'}`"
                    color="green"
                    class="mt-2"
                ></v-switch>
                <v-divider class="mx-2"></v-divider>
                <p class="mb-0 red--text">Tanda "<v-icon color="red" class="">{{ localConfig.requiredInputIcon }}</v-icon>" menandakan WAJIB DIISI.</p>
            </div>
            <!-- MU TA DESA -->
            <div v-if="!this.id">
                <div class="pb-2 d-flex align-center mt-4">
                    <p class="mb-0"><v-icon class="mr-2">mdi-file-marker</v-icon>Area Kerja FF</p>
                    <v-divider class="mx-2"></v-divider>
                </div>
                <v-row class="">
                    <!-- Management Unit -->
                    <v-col cols="12" lg="4">
                        <v-autocomplete
                            color="success"
                            item-color="success"
                            placeholder="Pilih Satu"
                            hide-details
                            outlined
                            rounded
                            dense
                            :rules="[(v) => !!v || 'Field is required']"
                            item-text="name"
                            item-value="mu_no"
                            :items="inputs.mu_no.items"
                            :label="inputs.mu_no.label"
                            :loading="inputs.mu_no.loading"
                            :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                            :no-data-text="inputs.mu_no.loading ? 'Loading...' : 'Tidak ada data.'"
                            v-model="inputs.mu_no.model"
                            @change="($val) => getOptions('target_area', $val)"
                        >
                            <template v-slot:label>
                                <v-icon v-if="inputs.mu_no.labelIcon" class="mr-1">{{ inputs.mu_no.labelIcon }}</v-icon>
                                {{ inputs.mu_no.label }} 
                                <sup><v-icon v-if="inputs.mu_no.required" small style="vertical-align: middle;">{{ localConfig.requiredInputIcon }}</v-icon></sup>
                            </template>
                        </v-autocomplete>
                    </v-col>
                    <!-- Target Area -->
                    <v-col cols="12" lg="4">
                        <v-autocomplete
                            color="success"
                            item-color="success"
                            placeholder="Pilih Satu"
                            hide-details
                            outlined
                            rounded
                            dense
                            :rules="[(v) => !!v || 'Field is required']"
                            item-text="name"
                            item-value="area_code"
                            :items="inputs.target_area.items"
                            :label="inputs.target_area.label"
                            :loading="inputs.target_area.loading"
                            :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                            :no-data-text="inputs.target_area.loading ? 'Loading...' : 'Tidak ada data.'"
                            v-model="inputs.target_area.model"
                            :disabled="!inputs.mu_no.model"
                            @change="($val) => getOptions('working_area', $val)"
                        >
                            <template v-slot:label>
                                <v-icon v-if="inputs.target_area.labelIcon" class="mr-1">{{ inputs.target_area.labelIcon }}</v-icon>
                                {{ inputs.target_area.label }} 
                                <sup><v-icon v-if="inputs.target_area.required" small style="vertical-align: middle;">{{ localConfig.requiredInputIcon }}</v-icon></sup>
                            </template>
                        </v-autocomplete>
                    </v-col>
                    <!-- Working Area / Desa -->
                    <v-col cols="12" lg="4">
                        <v-autocomplete
                            color="success"
                            item-color="success"
                            placeholder="Pilih Satu"
                            hide-details
                            outlined
                            rounded
                            dense
                            :rules="[(v) => !!v || 'Field is required']"
                            item-text="name"
                            item-value="kode_desa"
                            :items="inputs.working_area.items"
                            :label="inputs.working_area.label"
                            :loading="inputs.working_area.loading"
                            :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                            :no-data-text="inputs.working_area.loading ? 'Loading...' : 'Tidak ada data.'"
                            v-model="inputs.working_area.model"
                            :disabled="!inputs.target_area.model"
                        >
                            <template v-slot:label>
                                <v-icon v-if="inputs.working_area.labelIcon" class="mr-1">{{ inputs.working_area.labelIcon }}</v-icon>
                                {{ inputs.working_area.label }} 
                                <sup><v-icon v-if="inputs.working_area.required" small style="vertical-align: middle;">{{ localConfig.requiredInputIcon }}</v-icon></sup>
                            </template>
                        </v-autocomplete>
                    </v-col>
                </v-row>
                <!-- PIC status (aktif/non) -->
                <div class="pb-2 d-flex align-center mt-4">
                    <p class="mb-0"><v-icon class="mr-2">mdi-account-tie-hat</v-icon>PIC T4T (Field Coordinator)</p>
                    <v-divider class="mx-2"></v-divider>
                </div>
                <v-row class="">
                    <!-- fc_no -->
                    <v-col cols="12" lg="8">
                        <v-autocomplete
                            color="success"
                            item-color="success"
                            placeholder="Pilih Satu"
                            hide-details
                            outlined
                            rounded
                            dense
                            :rules="[(v) => !!v || 'Field is required']"
                            item-text="name"
                            item-value="nik"
                            :items="inputs.fc_no.items"
                            :label="inputs.fc_no.label"
                            :loading="inputs.fc_no.loading"
                            :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                            :no-data-text="inputs.fc_no.loading ? 'Loading...' : 'Tidak ada data.'"
                            v-model="inputs.fc_no.model"
                        >
                            <template v-slot:label>
                                <v-icon v-if="inputs.fc_no.labelIcon" class="mr-1">{{ inputs.fc_no.labelIcon }}</v-icon>
                                {{ inputs.fc_no.label }} 
                                <sup><v-icon v-if="inputs.fc_no.required" small style="vertical-align: middle;">{{ localConfig.requiredInputIcon }}</v-icon></sup>
                            </template>
                        </v-autocomplete>
                    </v-col>
                    <!-- Status -->
                    <v-col cols="12" lg="4">
                        <v-switch
                            v-model="inputs.active.model"
                            :label="`Status FF : ${inputs.active.model ? 'Aktif' : 'Non-Aktif'}`"
                            color="green"
                            class="mt-2"
                        ></v-switch>
                    </v-col>
                </v-row>
            </div>
            <div class="pb-2 d-flex align-center mt-4">
                <p class="mb-0"><v-icon class="mr-2">mdi-card-account-details</v-icon>Identitas FF</p>
                <v-divider class="mx-2"></v-divider>
            </div>
            <v-row class="">
                <v-col v-if="false" cols="12" lg="4">
                    Foto
                </v-col>
                <v-col cols="12" lg="12">
                    <v-row class="">
                        <!-- Nama FF -->
                        <v-col cols="12" lg="6">
                            <v-text-field
                                color="success"
                                dense
                                hide-details
                                :label="inputs.name.label"
                                :placeholder="inputs.name.placeholder"
                                :disabled="false"
                                outlined
                                rounded
                                :rules="[(v) => !!v || 'Field is required']"
                                v-model="inputs.name.model"
                            >
                                <template v-slot:label>
                                    <v-icon v-if="inputs.name.labelIcon" class="mr-1">{{ inputs.name.labelIcon }}</v-icon>
                                    {{ inputs.name.label }} 
                                    <sup><v-icon v-if="inputs.name.required" small style="vertical-align: middle;">{{ localConfig.requiredInputIcon }}</v-icon></sup>
                                </template>
                            </v-text-field>
                        </v-col>
                        <!-- Gender -->
                        <v-col cols="12" lg="6">
                            <v-autocomplete
                                color="success"
                                item-color="success"
                                placeholder="Pilih Satu"
                                hide-details
                                outlined
                                rounded
                                dense
                                :rules="[(v) => !!v || 'Field is required']"
                                :items="inputs.gender.items"
                                :label="inputs.gender.label"
                                :loading="inputs.gender.loading"
                                :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                                :no-data-text="inputs.gender.loading ? 'Loading...' : 'Tidak ada data.'"
                                v-model="inputs.gender.model"
                            ></v-autocomplete>
                        </v-col>
                        <!-- religion -->
                        <v-col cols="12" lg="6">
                            <v-autocomplete
                                color="success"
                                item-color="success"
                                placeholder="Pilih Satu"
                                hide-details
                                outlined
                                rounded
                                dense
                                :rules="[(v) => !!v || 'Field is required']"
                                :items="inputs.religion.items"
                                :label="inputs.religion.label"
                                :loading="inputs.religion.loading"
                                :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                                :no-data-text="inputs.religion.loading ? 'Loading...' : 'Tidak ada data.'"
                                v-model="inputs.religion.model"
                            ></v-autocomplete>
                        </v-col>
                        <!-- Phone -->
                        <v-col cols="12" lg="6">
                            <v-text-field
                                color="success"
                                dense
                                hide-details
                                :prefix="inputs.phone.prefix"
                                :label="inputs.phone.label"
                                :placeholder="inputs.phone.placeholder"
                                type="number"
                                :disabled="false"
                                outlined
                                rounded
                                :rules="[(v) => !!v || 'Field is required']"
                                v-model="inputs.phone.model"
                            ></v-text-field>
                        </v-col>
                        <!-- Birth Date -->
                        <v-col cols="12" lg="6">
                            <v-menu 
                                rounded="xl"
                                transition="slide-x-transition"
                                bottom
                                min-width="100"
                                offset-y
                                :close-on-content-click="true"
                                v-model="inputs.birthday.show"
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
                                                label="Tanggal Lahir"
                                                rounded
                                                v-bind="attrs"
                                                v-on="{...menu, ...tooltip}"
                                                readonly
                                                v-model="inputs.birthday.modelShow"
                                            ></v-text-field>
                                        </template>
                                        <span>Klik untuk memunculkan tanggal</span>
                                    </v-tooltip>
                                </template>
                                <div class="rounded-xl pb-2 white">
                                    <div class="d-flex flex-column align-center rounded-xl">
                                        <v-date-picker 
                                            color="green lighten-1 rounded-xl" 
                                            v-model="inputs.birthday.model"
                                        ></v-date-picker>
                                    </div>
                                </div>
                            </v-menu>
                        </v-col>
                        <!-- NO ktp_no -->
                        <v-col cols="12" lg="6">
                            <v-text-field
                                color="success"
                                type="number"
                                dense
                                hide-details
                                max="9999999999999999"
                                :label="inputs.ktp_no.label"
                                :placeholder="inputs.ktp_no.placeholder"
                                :disabled="false"
                                outlined
                                rounded
                                :suffix="`${inputs.ktp_no.model.length} / 16`"
                                :rules="[(v) => !!v || 'Field is required']"
                                v-model="inputs.ktp_no.model"
                            >
                                <template v-slot:label>
                                    <v-icon v-if="inputs.ktp_no.labelIcon" class="mr-1">{{ inputs.ktp_no.labelIcon }}</v-icon>
                                    {{ inputs.ktp_no.label }} 
                                    <sup><v-icon v-if="inputs.ktp_no.required" small style="vertical-align: middle;">{{ localConfig.requiredInputIcon }}</v-icon></sup>
                                </template>
                            </v-text-field>
                        </v-col>
                        <!-- status kawin -->
                        <v-col cols="12" lg="6">
                            <v-autocomplete
                                color="success"
                                item-color="success"
                                placeholder="Pilih Satu"
                                hide-details
                                outlined
                                rounded
                                dense
                                :rules="[(v) => !!v || 'Field is required']"
                                :items="inputs.marrital.items"
                                :label="inputs.marrital.label"
                                :loading="inputs.marrital.loading"
                                :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                                :no-data-text="inputs.marrital.loading ? 'Loading...' : 'Tidak ada data.'"
                                v-model="inputs.marrital.model"
                            ></v-autocomplete>
                        </v-col>
                        <!-- join_date -->
                        <v-col cols="12" lg="6">
                            <v-menu 
                                rounded="xl"
                                transition="slide-x-transition"
                                bottom
                                min-width="100"
                                offset-y
                                :close-on-content-click="true"
                                v-model="inputs.join_date.show"
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
                                                label="Tanggal Bergabung"
                                                rounded
                                                v-bind="attrs"
                                                v-on="{...menu, ...tooltip}"
                                                readonly
                                                v-model="inputs.join_date.modelShow"
                                            ></v-text-field>
                                        </template>
                                        <span>Klik untuk memunculkan tanggal</span>
                                    </v-tooltip>
                                </template>
                                <div class="rounded-xl pb-2 white">
                                    <div class="d-flex flex-column align-center rounded-xl">
                                        <v-date-picker 
                                            color="green lighten-1 rounded-xl" 
                                            v-model="inputs.join_date.model"
                                        ></v-date-picker>
                                    </div>
                                </div>
                            </v-menu>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
            <!-- Domisili -->
            <div class="pb-2 d-flex align-center mt-4">
                <p class="mb-0"><v-icon class="mr-2">mdi-map-marker-radius</v-icon>Domisili FF</p>
                <v-divider class="mx-2"></v-divider>
            </div>
            <v-row class="">
                <!-- Province -->
                <v-col cols="12" lg="4">
                    <v-autocomplete
                        color="success"
                        item-color="success"
                        placeholder="Pilih Satu"
                        hide-details
                        outlined
                        rounded
                        dense
                        :rules="[(v) => !!v || 'Field is required']"
                        item-text="name"
                        item-value="province_code"
                        :items="inputs.province.items"
                        :label="inputs.province.label"
                        :loading="inputs.province.loading"
                        :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                        :no-data-text="inputs.province.loading ? 'Loading...' : 'Tidak ada data.'"
                        v-model="inputs.province.model"
                        @change="($val) => getOptions('city', $val)"
                    ></v-autocomplete>
                </v-col>
                <!-- Kota / Kabupaten -->
                <v-col cols="12" lg="4">
                    <v-autocomplete
                        color="success"
                        item-color="success"
                        placeholder="Pilih Satu"
                        hide-details
                        outlined
                        rounded
                        dense
                        :rules="[(v) => !!v || 'Field is required']"
                        item-text="name"
                        item-value="kabupaten_no"
                        :items="inputs.city.items"
                        :label="inputs.city.label"
                        :loading="inputs.city.loading"
                        :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                        :no-data-text="inputs.city.loading ? 'Loading...' : 'Tidak ada data.'"
                        v-model="inputs.city.model"
                        :disabled="!inputs.province.model"
                        @change="($val) => getOptions('kecamatan', $val)"
                    ></v-autocomplete>
                </v-col>
                <!-- Kecamatan -->
                <v-col cols="12" lg="4">
                    <v-autocomplete
                        color="success"
                        item-color="success"
                        placeholder="Pilih Satu"
                        hide-details
                        outlined
                        rounded
                        dense
                        :rules="[(v) => !!v || 'Field is required']"
                        item-text="name"
                        item-value="kode_kecamatan"
                        :items="inputs.kecamatan.items"
                        :label="inputs.kecamatan.label"
                        :loading="inputs.kecamatan.loading"
                        :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                        :no-data-text="inputs.kecamatan.loading ? 'Loading...' : 'Tidak ada data.'"
                        v-model="inputs.kecamatan.model"
                        :disabled="!inputs.city.model"
                        @change="($val) => getOptions('village', $val)"
                    ></v-autocomplete>
                </v-col>
                <!-- Desa -->
                <v-col cols="12" lg="4">
                    <v-autocomplete
                        color="success"
                        item-color="success"
                        placeholder="Pilih Satu"
                        hide-details
                        outlined
                        rounded
                        dense
                        :rules="[(v) => !!v || 'Field is required']"
                        item-text="name"
                        item-value="kode_desa"
                        :items="inputs.village.items"
                        :label="inputs.village.label"
                        :loading="inputs.village.loading"
                        :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                        :no-data-text="inputs.village.loading ? 'Loading...' : 'Tidak ada data.'"
                        v-model="inputs.village.model"
                        :disabled="!inputs.kecamatan.model"
                    ></v-autocomplete>
                </v-col>
                <!-- Address detail -->
                <v-col cols="12" lg="4">
                    <v-text-field
                        color="success"
                        dense
                        hide-details
                        :label="inputs.address.label"
                        :placeholder="inputs.address.placeholder"
                        :disabled="false"
                        outlined
                        rounded
                        v-model="inputs.address.model"
                    ></v-text-field>
                </v-col>
                <!-- Postal Code -->
                <v-col cols="12" lg="4">
                    <v-text-field
                        color="success"
                        type="number"
                        min="11111"
                        max="99999"
                        dense
                        hide-details
                        :label="inputs.post_code.label"
                        :placeholder="inputs.post_code.placeholder"
                        :disabled="false"
                        outlined
                        rounded
                        v-model="inputs.post_code.model"
                    ></v-text-field>
                </v-col>
            </v-row>
            <!-- Bank Detail -->
            <div class="pb-2 d-flex align-center mt-4">
                <p class="mb-0"><v-icon class="mr-2">mdi-bank</v-icon>Bank</p>
                <v-divider class="mx-2"></v-divider>
            </div>
            <v-row class="">
                <!-- bank Name -->
                <v-col cols="12" lg="4">
                    <v-text-field
                        color="success"
                        dense
                        hide-details
                        :label="inputs.bank_name.label"
                        :placeholder="inputs.bank_name.placeholder"
                        :disabled="false"
                        outlined
                        rounded
                        v-model="inputs.bank_name.model"
                    ></v-text-field>
                </v-col>
                <!-- Bank Account -->
                <v-col cols="12" lg="4">
                    <v-text-field
                        color="success"
                        dense
                        hide-details
                        :label="inputs.bank_account.label"
                        :placeholder="inputs.bank_account.placeholder"
                        :disabled="false"
                        outlined
                        rounded
                        v-model="inputs.bank_account.model"
                    ></v-text-field>
                </v-col>
            </v-row>
            <!-- Pemetaan FF -->
            <div v-if="this.id">
                <!-- fc_ff -->
                <div class="pb-2 d-flex align-center mt-4">
                    <p class="mb-0"><v-icon class="mr-2">mdi-account-network</v-icon>Pemetaan PIC / FC</p>
                    <v-divider class="mx-2"></v-divider>
                </div>
                <v-row v-for="(fcFf, fcFfIndex) in inputs_update.fc_ff" :key="`FC-FF-Form-${fcFfIndex}`">
                    <v-col cols="auto" class="d-flex align-start">
                        <v-btn fab x-small color="green white--text" class="elevation-0"><v-icon>mdi-numeric-{{ fcFfIndex + 1 }}</v-icon></v-btn>
                    </v-col>
                    <v-col cols="12" lg="11">
                        <v-row>
                            <!-- fc_no -->
                            <v-col cols="12" lg="6">
                                <v-autocomplete
                                    color="success"
                                    item-color="success"
                                    placeholder="Pilih Satu"
                                    hide-details
                                    outlined
                                    rounded
                                    dense
                                    :rules="[(v) => !!v || 'Field is required']"
                                    item-text="name"
                                    item-value="nik"
                                    :items="pemetaanOptions('fc_ff', 'fc', fcFfIndex)"
                                    :label="inputs.fc_no.label"
                                    :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                                    v-model="fcFf.key1"
                                >
                                    <template v-slot:label>
                                        <v-icon v-if="inputs.fc_no.labelIcon" class="mr-1">{{ inputs.fc_no.labelIcon }}</v-icon>
                                        {{ inputs.fc_no.label }} 
                                        <sup><v-icon v-if="inputs.fc_no.required" small style="vertical-align: middle;">{{ localConfig.requiredInputIcon }}</v-icon></sup>
                                    </template>
                                </v-autocomplete>
                            </v-col>
                            <v-col cols="12" lg="6">
                                <!-- combobox -->
                                <v-autocomplete
                                    dense
                                    multiple
                                    color="success"
                                    hide-details
                                    small-chips
                                    hide-selected
                                    item-color="success"
                                    :items="pemetaanOptions('fc_ff', 'program_year', fcFfIndex)"
                                    :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                                    outlined
                                    rounded
                                    v-model="fcFf.program_year"
                                >
                                    <template v-slot:label>
                                        Tahun Program
                                        <sup><v-icon small style="vertical-align: middle;">{{ localConfig.requiredInputIcon }}</v-icon></sup>
                                    </template>
                                    <template v-slot:no-data>
                                        <v-list-item>
                                        <v-list-item-content>
                                            <v-list-item-title>
                                            No results matching. Press <kbd>enter</kbd> to create a new one
                                            </v-list-item-title>
                                        </v-list-item-content>
                                        </v-list-item>
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
                                                {{ item.text || item }}
                                            </span>
                                            <v-icon
                                                small
                                                @click="parent.selectItem(item)"
                                            >
                                                mdi-close-circle
                                            </v-icon>
                                        </v-chip>
                                    </template>
                                </v-autocomplete>
                            </v-col>
                        </v-row>
                    </v-col>
                </v-row>
                <v-row class="justify-center">
                    <v-btn
                        data-aos="fade-right" data-aos-offset="-10000" 
                        :key="`fc_ff_plus_btn`" 
                        fab small color="green white--text" class="mx-1" 
                        @click="() => modifyTotalSubData('+', 'fc_ff')"
                    >
                        <v-icon>mdi-plus</v-icon>
                    </v-btn>
                    <v-btn v-if="inputs_update.fc_ff.length > 1" 
                        data-aos="fade-left" data-aos-offset="-10000" 
                        :key="`fc_ff_minus_btn`" 
                        fab small color="red" outlined class="mx-1"
                        @click="() => modifyTotalSubData('-', 'fc_ff')"
                    >
                        <v-icon>mdi-minus</v-icon>
                    </v-btn>
                </v-row>
                <!-- working_areas -->
                <div class="pb-2 d-flex align-center mt-4">
                    <p class="mb-0"><v-icon class="mr-2">mdi-map-marker-distance</v-icon>Pemetaan Area Kerja</p>
                    <v-divider class="mx-2"></v-divider>
                </div>
                <v-row v-for="(workingArea, workingAreaIndex) in inputs_update.working_areas" :key="`Working-Area-Form-${workingAreaIndex}`">
                    <v-col cols="auto" class="d-flex align-start">
                        <v-btn fab x-small color="green white--text" class="elevation-0"><v-icon>mdi-numeric-{{ workingAreaIndex + 1 }}</v-icon></v-btn>
                    </v-col>
                    <v-col cols="12" lg="11">
                        <v-row>
                            <!-- program_year -->
                            <v-col cols="12" lg="6">
                                <v-autocomplete
                                    dense
                                    multiple
                                    color="success"
                                    hide-details
                                    small-chips
                                    hide-selected
                                    item-color="success"
                                    :items="pemetaanOptions('working_areas', 'program_year', workingAreaIndex)"
                                    :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                                    outlined
                                    rounded
                                    v-model="workingArea.program_year"
                                >
                                    <template v-slot:label>
                                        Tahun Program
                                        <sup><v-icon small style="vertical-align: middle;">{{ localConfig.requiredInputIcon }}</v-icon></sup>
                                    </template>
                                    <template v-slot:no-data>
                                        <v-list-item>
                                        <v-list-item-content>
                                            <v-list-item-title>
                                            No results matching. Press <kbd>enter</kbd> to create a new one
                                            </v-list-item-title>
                                        </v-list-item-content>
                                        </v-list-item>
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
                                                {{ item.text || item }}
                                            </span>
                                            <v-icon
                                                small
                                                @click="parent.selectItem(item)"
                                            >
                                                mdi-close-circle
                                            </v-icon>
                                        </v-chip>
                                    </template>
                                </v-autocomplete>
                            </v-col>
                            <!-- mu_no -->
                            <v-col cols="12" lg="6">
                                <v-autocomplete
                                    color="success"
                                    item-color="success"
                                    placeholder="Pilih Satu"
                                    hide-details
                                    outlined
                                    rounded
                                    dense
                                    :rules="[(v) => !!v || 'Field is required']"
                                    item-text="name"
                                    item-value="mu_no"
                                    :items="pemetaanOptions('working_areas', 'mu_no', workingAreaIndex)"
                                    :label="inputs.mu_no.label"
                                    :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                                    v-model="workingArea.mu_no"
                                >
                                    <template v-slot:label>
                                        <v-icon v-if="inputs.mu_no.labelIcon" class="mr-1">{{ inputs.mu_no.labelIcon }}</v-icon>
                                        {{ inputs.mu_no.label }} 
                                        <sup><v-icon v-if="inputs.mu_no.required" small style="vertical-align: middle;">{{ localConfig.requiredInputIcon }}</v-icon></sup>
                                    </template>
                                </v-autocomplete>
                            </v-col>
                            <!-- target_area -->
                            <v-col cols="12" lg="6">
                                <v-autocomplete
                                    color="success"
                                    item-color="success"
                                    placeholder="Pilih Satu"
                                    hide-details
                                    outlined
                                    rounded
                                    dense
                                    :rules="[(v) => !!v || 'Field is required']"
                                    item-text="name"
                                    item-value="target_area"
                                    :items="pemetaanOptions('working_areas', 'target_area', workingAreaIndex)"
                                    :label="inputs.target_area.label"
                                    :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                                    :disabled="!workingArea.mu_no"
                                    v-model="workingArea.target_area"
                                >
                                    <template v-slot:label>
                                        <v-icon v-if="inputs.target_area.labelIcon" class="mr-1">{{ inputs.target_area.labelIcon }}</v-icon>
                                        {{ inputs.target_area.label }} 
                                        <sup><v-icon v-if="inputs.target_area.required" small style="vertical-align: middle;">{{ localConfig.requiredInputIcon }}</v-icon></sup>
                                    </template>
                                </v-autocomplete>
                            </v-col>
                            <!-- working_area -->
                            <v-col cols="12" lg="6">
                                <v-autocomplete
                                    color="success"
                                    item-color="success"
                                    placeholder="Pilih Satu"
                                    hide-details
                                    outlined
                                    rounded
                                    dense
                                    :rules="[(v) => !!v || 'Field is required']"
                                    item-text="name"
                                    item-value="working_area"
                                    :items="pemetaanOptions('working_areas', 'working_area', workingAreaIndex)"
                                    :label="inputs.working_area.label"
                                    :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                                    :disabled="!workingArea.target_area"
                                    v-model="workingArea.working_area"
                                >
                                    <template v-slot:label>
                                        <v-icon v-if="inputs.working_area.labelIcon" class="mr-1">{{ inputs.working_area.labelIcon }}</v-icon>
                                        {{ inputs.working_area.label }} 
                                        <sup><v-icon v-if="inputs.working_area.required" small style="vertical-align: middle;">{{ localConfig.requiredInputIcon }}</v-icon></sup>
                                    </template>
                                    <template v-slot:item="data">
                                    <v-list-item-content>
                                        <v-list-item-title v-html="data.item.name"></v-list-item-title>
                                        <v-list-item-subtitle>Kecamatan: {{ data.item.namaKecamatan }}</v-list-item-subtitle>
                                    </v-list-item-content>
                                    </template>
                                </v-autocomplete>
                            </v-col>
                        </v-row>
                    </v-col>
                </v-row>
                <v-row class="justify-center">
                    <v-btn
                        data-aos="fade-right" data-aos-offset="-10000" 
                        :key="`working_areas_plus_btn`" 
                        fab small color="green white--text" class="mx-1" 
                        @click="() => modifyTotalSubData('+', 'working_areas')"
                    >
                        <v-icon>mdi-plus</v-icon>
                    </v-btn>
                    <v-btn v-if="inputs_update.working_areas.length > 1" 
                        data-aos="fade-left" data-aos-offset="-10000" 
                        :key="`working_areas_minus_btn`" 
                        fab small color="red" outlined class="mx-1"
                        @click="() => modifyTotalSubData('-', 'working_areas')"
                    >
                        <v-icon>mdi-minus</v-icon>
                    </v-btn>
                </v-row>
            </div>
        </v-card-text>
        <v-card-actions class="justify-end">
            <v-btn v-if="!this.id" :disabled="disabledSave" rounded color="blue white--text" class="px-4" @click="save()">
                <v-icon class="mr-1">mdi-content-save</v-icon>
                Save
            </v-btn>
            <v-btn v-if="this.id" :disabled="disabledUpdate" rounded color="blue white--text" class="px-4" @click="update()">
                <v-icon class="mr-1">mdi-content-save</v-icon>
                Update
            </v-btn>
        </v-card-actions>
    </v-card>
    </v-dialog>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
import Swal from 'sweetalert2'

import formOptions from '@/assets/json/ffOptions.json'

export default {
    props: {
        programYear: {
            type: String,
            default: moment().format('YYYY')
        },
        show: {
            type: Boolean,
            default: false
        },
        id: {
            type: String,
            default: 0
        }
    },
    data: () => ({
        inputs: {
            program_year: {
                label: 'Tahun Program',
                model: '',
                placeholder: moment().format('YYYY'),
                required: true
            },
            // MU TA DESA
            mu_no: {
                label: 'Management Unit',
                model: '',
                required: true,
                items: [],
                loading: false,
            },
            target_area: {
                label: 'Target Area',
                model: '',
                items: [],
                loading: false,
                required: true
            },
            working_area: {
                label: 'Working Area / Desa',
                model: '',
                items: [],
                loading: false,
                required: true
            },
            // fc_no
            fc_no: {
                label: 'Field Coordinator',
                model: '',
                items: [],
                loading: false,
                required: true
            },
            active: {model: true},
            // Foto nama gender religi
            photo: {model: ''},
            name: {
                label: 'Nama',
                model: '',
                placeholder: '',
                required: true
            },
            // gender
            gender: {
                label: 'Jenis Kelamin',
                model: '',
                items: formOptions.gender,
                loading: false
            },
            // religion
            religion: {
                label: 'Agama',
                model: '',
                items: formOptions.religion,
                loading: false
            },
            // phone birth date
            phone: {
                label: 'Nomor HP',
                model: '',
                prefix: '+62',
                placeholder: '82223318719'
            },
            birthday: {
                loading: false,
                model: moment().format('Y-MM-DD'),
                modelShow: moment().format('DD MMMM Y'),
                show: false,
            },
            // ktp_no
            ktp_no: {
                label: 'NIK / No KTP',
                model: '',
                placeholder: 'isi dengan 16-digit angka',
                required: true
            },
            // marrital
            marrital: {
                label: 'Status Perkawinan',
                model: '',
                items: formOptions.marital_status,
                loading: false
            },
            // domisili
            province: {
                label: 'Provinsi',
                model: '',
                items: [],
                loading: false,
            },
            city: {
                label: 'Kota / Kabupaten',
                model: '',
                items: [],
                loading: false,
            },
            kecamatan: {
                label: 'Kecamatan',
                model: '',
                items: [],
                loading: false,
            },
            village: {
                label: 'Desa',
                model: '',
                items: [],
                loading: false,
            },
            // address
            address: {
                label: 'Detail Alamat',
                model: '',
                placeholder: ''
            },
            // postal Code
            post_code: {
                label: 'Kode POS',
                model: '',
                placeholder: ''
            },
            bank_name: {
                label: 'Nama Bank',
                model: '',
                placeholder: ''
            },
            bank_account: {
                label: 'No Rekening / Akun',
                model: '',
                placeholder: ''
            },
            user_id: {model: ''},
            join_date: {
                loading: false,
                model: moment().format('Y-MM-DD'),
                modelShow: moment().format('DD MMMM Y'),
                show: false,
            },
        },
        inputs_update: {
            ff_no: '',
            fc_ff: [],
            working_areas: [],
        },
        loading: {
            show: false,
            text: 'Loading...'
        },
        localConfig: {
            windowWidth: window.innerWidth,
            breakLayoutFrom: 1140,
            requiredInputIcon: 'mdi-star'
        },
    }),
    computed: {
        showModal: {
            get: function () {
                if (this.id && this.show) {
                    this.getEditData(this.id)
                } else if (this.show && !this.id) {
                    setTimeout(() => {
                        this.setDefaultData()
                    }, 300);
                }
                
                return this.show
            },
            set: function(newVal) {
                this.$emit('dialogAct', {name: 'addEditFF', status: newVal});
            }
        },
        disabledSave() {
            const required = ['mu_no', 'target_area', 'working_area', 'fc_no', 'name', 'ktp_no', 'program_year']
            let empty = 0
            required.forEach(val => {
                if (val == 'program_year') {
                    if (this.inputs[val].model == 'Semua') empty += 1
                }
                
                if (!this.inputs[val].model) empty += 1
            })
            if (empty > 0) return true
            if (this.inputs.ktp_no.model.length != 16) return true
            return false
        },
        disabledUpdate() {
            const required = ['name', 'ktp_no']
            let error = 0
            required.forEach(val => {
                if (!this.inputs[val].model) error += 1
            })
            if (this.inputs.ktp_no.model.length != 16) error += 1
            const fc_ff = this.inputs_update.fc_ff || []
            if (fc_ff.length > 0) {
                fc_ff.forEach(ffc => {
                    if (!ffc.key1 || ffc.program_year.length < 1) error += 1  
                })
            }
            const working_areas = this.inputs_update.working_areas || []
            if (working_areas.length > 0) {
                working_areas.forEach(was => {
                    if (!was.mu_no || !was.target_area || !was.working_area || was.program_year.length < 1) error += 1  
                })
            }
            
            if (error > 0) return true
            return false
        }
    },
    watch: {
        'inputs.phone.model': {
            handler(val) {
            }
        },
        'inputs.birthday.model': {
            handler(val) {
                this.inputs.birthday.modelShow = moment(val).format('DD MMMM Y')
            }
        },
        'inputs.join_date.model': {
            handler(val) {
                this.inputs.join_date.modelShow = moment(val).format('DD MMMM Y')
            }
        },
        'inputs.ktp_no.model': {
            async handler(val, oldVal) {
                if (val.length > 16) {
                    const confirm = await Swal.fire({
                        title: 'Warning!',
                        text: "Format data ktp adalah 16 digit angka!",
                        icon: 'warning',
                        confirmButtonColor: '#2e7d32',
                        confirmButtonText: 'Okay'
                    })
                    if (confirm.isConfirmed) this.inputs.ktp_no.model = oldVal
                }
            }
        },
        'inputs.program_year.model': {
            handler(val) {
                this.inputs.mu_no.model = ''
                this.inputs.target_area.model = ''
                this.inputs.village.model = ''
                this.getOptions('mu_no')
            }
        }
    },
    methods: {
        async getEditData(ff_id) {
            try {
                this.loading.show = true
                this.loading.text = 'Preparing form data...'
                this.inputs.program_year.model = this.programYear
                await this.getOptions('fc_no')
                await this.getOptions('province')
                await this.getOptions('mu_no')
                await this.getOptions('target_area')
                await this.getOptions('working_area')
                this.loading.text = 'Get ff data...'
                const res = await axios.get(this.$store.getters.getApiUrl(`GetFieldFacilitatorDetail?id=${ff_id}`), this.$store.state.apiConfig)
                const setDataToInputs = ['name', 'gender', 'religion', 'phone', 'birthday', 'ktp_no', 'marrital', 'province', 'city', 'kecamatan', 'village', 'address', 'post_code', 'bank_name', 'bank_account', 'active', 'join_date']
                const data = res.data.data.result
                for (const[key, val] of Object.entries(data)) {
                    if (setDataToInputs.includes(key)) this.inputs[key].model = val
                }
                this.inputs_update.ff_no = data.ff_no
                this.inputs_update.fc_ff = data.fc_ff.map(val => {return {...val, program_year: val.program_year.split(',')}})
                this.inputs_update.working_areas = data.working_areas.map(val_wa => {return {
                    ...val_wa, 
                    target_area: val_wa.area_code, 
                    working_area: val_wa.kode_desa, 
                    program_year: val_wa.program_year.split(',')
                }})
            } catch (err) {
                this.catchingError(err)
            } finally {
                this.loading.show = false
            }
        },
        async getOptions(type, id = null) {
            try {
                this.inputs[type].loading = true
                this.inputs[type].model = ''
                let program_year = this.inputs.program_year.model
                if (this.id) program_year = ''
                let url = ''
                if (type == 'mu_no') url = this.$store.getters.getApiUrl(`GetManagementUnit?program_year=${program_year}`)
                if (type == 'target_area') url = this.$store.getters.getApiUrl(`GetTargetArea${id ? '' : 'Admin'}?program_year=${program_year}&mu_no=${id}`)
                if (type == 'working_area') url = this.$store.getters.getApiUrl(`GetDesa${id ? '' : 'Admin'}?program_year=${program_year}&kode_ta=${id}`)
                if (type == 'province') url = this.$store.getters.getApiUrl('GetProvince')
                if (type == 'city') url = this.$store.getters.getApiUrl('GetKabupaten?province_code=' + id)
                if (type == 'kecamatan') url = this.$store.getters.getApiUrl('GetKecamatan?kabupaten_no=' + id)
                if (type == 'village') url = this.$store.getters.getApiUrl('GetDesa?&kode_kecamatan=' + id)
                if (type == 'fc_no') url = this.$store.getters.getApiUrl(`GetEmployeeAll?position_no=19`)

                if (url) {
                    const res = await axios.get(url, this.$store.state.apiConfig)
                    let data = []
                    if (type == 'fc_no') data = await res.data.data.result.data
                    else data = await res.data.data.result
                    this.inputs[type].items = await data.sort((a, b) => a.name.localeCompare(b.name))
                }
            } catch (err) {this.catchingError(err)} finally {
                // reset options data
                if (type == 'mu_no') {
                    this.inputs.target_area.model = ''
                    this.inputs.target_area.items = []
                }
                if (type == 'mu_no' || type == 'target_area') {
                    this.inputs.working_area.model = ''
                    this.inputs.working_area.items = []
                }
                
                this.inputs[type].loading = false
            }
        },
        async save() {
            try {
                const confirm = await Swal.fire({
                    title: 'Apakah anda yakin?',
                    text: "Pastikan data sudah benar!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#2e7d32',
                    cancelButtonColor: '#d33',
                    cancelButtonText: 'Tidak Jadi',
                    confirmButtonText: 'Ya, Lanjutkan!'
                })
                if (confirm.isConfirmed) {
                    this.loading.show = true
                    this.loading.text = 'Saving ff data...'

                    await this.setDataBeforeStore()
                    const data = {}
                    for (const [key, val] of Object.entries(this.inputs)) {
                        if (key == 'phone' && val.model != '-') data[key] = '62' + val.model
                        else data[key] = val.model
                    }
                    console.log(data)
                    const createFF = await axios.post(this.$store.getters.getApiUrl('AddFieldFacilitator'), data, this.$store.state.apiConfig)
                    await this.$emit('refreshTable')
                    if (createFF && !this.id) {
                        const new_ff_no = createFF.data.data.result.ff_no
                        if (new_ff_no) {
                            const userData = {
                                employee_no: new_ff_no,
                                name: this.inputs.name.model,
                                email: this.setAccountEmailFF(this.inputs.name.model),
                                password: '123456',
                                role: "ff"
                            }
                            console.log(userData)
                            const confirm2 = await Swal.fire({
                                title: 'Akun GEKO FF',
                                html: `Berikut data akun ff yang akan dibuat: <br>
                                <p>Nama:<br><b>${userData.name}</b></p>
                                <p>Email:<br><b>${userData.email}</b></p>
                                <p>Password:<br><b>${userData.password}</b></p>
                                Harap diingat data akun diatas sebelum melanjutkan!
                                `,
                                icon: 'warning',
                                showCancelButton: false,
                                confirmButtonColor: '#2e7d32',
                                cancelButtonColor: '#d33',
                                cancelButtonText: 'Tidak',
                                confirmButtonText: 'Okay'
                            })
                            const res2 = await axios.post(this.$store.getters.getApiUrl(`Regist`), userData, this.$store.state.apiConfig)
                        } else console.log(`Created ff_no data not found!`)
                    }
                    await Swal.fire({
                        title: 'Sukses!',
                        text: "Selamat! Data FF sudah berhasil tersimpan!",
                        icon: 'success',
                        confirmButtonColor: '#2e7d32',
                        confirmButtonText: 'Oye'
                    })
                    await this.resetData()
                }
            } catch (err) {this.catchingError(err)} finally {
                this.loading.show = false
            }
        },
        setAccountEmailFF(name) {
            const nameSplit = name.split(/\s/)
            let newName = nameSplit[0]
            if (nameSplit.length > 0) newName += nameSplit.reduce((response,word)=> response+=word.slice(0,1),'').substring(1)
            const mu_name = this.inputs.mu_no.items.find(val => val.mu_no === this.inputs.mu_no.model).name || '-'
            const desa = this.inputs.working_area.items.find(val => val.kode_desa === this.inputs.working_area.model).name || '-'
            const email = `${newName}_${desa}_${mu_name}@t4t.org`
            return email.replace(/\s/g, '')
        },
        async setDataBeforeStore() {
            // gender
            !this.inputs.gender.model ? this.inputs.gender.model = 'male' : ''
            // religion
            !this.inputs.religion.model ? this.inputs.religion.model = 'islam' : ''
            // phone
            !this.inputs.phone.model ? this.inputs.phone.model = '-' : ''
            // birthday
            !this.inputs.birthday.model ? this.inputs.birthday.model = '1900-01-01' : ''
            // marrital
            !this.inputs.marrital.model ? this.inputs.marrital.model = '-' : ''
            // province
            !this.inputs.province.model ? this.inputs.province.model = '-' : ''
            // city
            !this.inputs.city.model ? this.inputs.city.model = '-' : ''
            // kecamatan
            !this.inputs.kecamatan.model ? this.inputs.kecamatan.model = '-' : ''
            // village
            !this.inputs.village.model ? this.inputs.village.model = '-' : ''
            // post_code
            !this.inputs.post_code.model ? this.inputs.post_code.model = '-' : ''
            // address
            !this.inputs.address.model ? this.inputs.address.model = '-' : ''
            // bank_name
            !this.inputs.bank_name.model ? this.inputs.bank_name.model = '-' : ''
            // bank_account
            !this.inputs.bank_account.model ? this.inputs.bank_account.model = '-' : ''
            // user id
            !this.inputs.user_id.model ? this.inputs.user_id.model = this.$store.state.User.employee_no : ''
            // join date
            this.inputs.join_date.model = moment().format('Y-MM-DD')
        },
        async setDefaultData() {
            try {
                this.loading.show = true
                this.loading.text = 'Get option data...'
                this.inputs.program_year.model = this.programYear
                await this.getOptions('mu_no')
                await this.getOptions('province')
                await this.getOptions('fc_no')
                
                // await this.setDummyData()
            } finally {this.loading.show = false}
        },
        async setDummyData() {
            this.loading.text = 'Set Dummy data... :)'
            this.inputs.mu_no.model = '016'
            await this.getOptions('target_area', this.inputs.mu_no.model)
            this.inputs.target_area.model = '016002'
            await this.getOptions('working_area', this.inputs.target_area.model)
            this.inputs.working_area.model = '33.74.12.01'
            this.inputs.fc_no.model = '1108'
            this.inputs.name.model = 'Testing Create FF'
            this.inputs.ktp_no.model = '3322022107010005'
        },
        async update() {
            try {
                const confirm = await Swal.fire({
                    title: 'Apakah anda yakin?',
                    text: "Pastikan data sudah benar!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#2e7d32',
                    cancelButtonColor: '#d33',
                    cancelButtonText: 'Tidak Jadi',
                    confirmButtonText: 'Ya, Lanjutkan!'
                })
                if (confirm.isConfirmed) {
                    this.loading.show = true
                    this.loading.text = 'Updating data...'
                    await this.setDataBeforeStore()
                    let dataToStore = {
                        id: this.id,
                        ff_no: this.inputs_update.ff_no
                    }
                    const inputsToStore = ['name', 'gender', 'religion', 'phone', 'birthday', 'ktp_no', 'marrital', 'province', 'city', 'kecamatan', 'village', 'address', 'post_code', 'bank_name', 'bank_account', 'active', 'join_date']
                    for (const[key, val] of Object.entries(this.inputs)) {
                        if (inputsToStore.includes(key)) dataToStore[key] = val.model || '-'
                    }
                    dataToStore.fc_ff = this.inputs_update.fc_ff.map(val => {return {...val, program_year: val.program_year.toString()}})
                    dataToStore.working_areas = this.inputs_update.working_areas.map(val => {return {
                        id: val.id,
                        ff_no: val.ff_no,
                        program_year: val.program_year.toString(),
                        mu_no: val.mu_no,
                        target_area: val.target_area,
                        working_area: val.working_area,
                    }})
                    // console.log(dataToStore)
                    const res = await axios.post(this.$store.getters.getApiUrl(`UpdateFieldFacilitator`), dataToStore, this.$store.state.apiConfig)
                    if (res) {
                        this.showModal = false
                        this.$emit('swal', {type: 'success', message: 'Yey! Data FF updated!'})
                    }
                    console.log(res.data)
                }
            } catch(err) {await this.catchingError(err)} finally {
                this.loading.show = false
                this.loading.text = 'Loading...'
            }
        },
        // utilities
        async catchingError(error) {
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
                        let errMessage = error.response.data.message || error.response.data
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
        async modifyTotalSubData(type, input) {
            if (type == '+') {
                let defaultData = {}
                if (input == 'fc_ff') {
                    defaultData = {
                        id: '',
                        key1: '',
                        key2:   this.inputs_update.ff_no,
                        program_year: []
                    }
                } else if (input == 'working_areas') {
                    defaultData = {
                        id: '',
                        ff_no:   this.inputs_update.ff_no,
                        mu_no: '',
                        target_area: '',
                        village: '',
                        program_year: []
                    }
                }
                this.inputs_update[input].push(defaultData)
            } else if (type == '-') this.inputs_update[input].pop()
        },  
        pemetaanOptions(type, inputs, index) {
            if (inputs == 'program_year') {
                let program_year = this.$store.state.programYear.options
                let usedPY = []
                this.inputs_update[type].map((val, valIndex) => {
                    if (valIndex != index) {
                        val.program_year.map(val2 => {
                            usedPY.push(val2)
                        })
                    }
                })
                program_year = program_year.map(val_py => {
                    let disabled = false
                    if (usedPY.includes(val_py)) {disabled = true}
                    return {
                        text: val_py,
                        value: val_py,
                        disabled: disabled
                    }
                })
                return program_year
            } else if (inputs == 'fc') {
                let list_fc = this.inputs.fc_no.items
                let usedFC = []
                this.inputs_update[type].map((val, valIndex) => {
                    if (valIndex != index) {
                        usedFC.push(val.key1)
                    }
                })
                list_fc = list_fc.map(val_fc => {
                    let disabled = false
                    if (usedFC.includes(val_fc.nik)) {disabled = true}
                    return {
                        ...val_fc,
                        disabled: disabled
                    }
                })
                return list_fc
            } else if (['mu_no', 'target_area'].includes(inputs)) {
                let set_list = this.inputs[inputs].items
                if (inputs == 'target_area') {
                    set_list = set_list.map(sl1 => {return {...sl1, target_area: sl1.area_code}})
                }
                let program_year = this.inputs_update[type][index].program_year
                let new_set_list = []
                set_list = set_list.map(val => {
                    let show = false
                    if (val.program_year) if (program_year.every(vpy => val.program_year.split(',').includes(vpy))) show = true
                    if (show) new_set_list.push(val)
                })
                if (inputs == 'target_area') {
                    new_set_list = new_set_list.map(nsl2 => {
                        if (nsl2.mu_no === this.inputs_update[type][index].mu_no) return nsl2
                        return null
                    }).filter(n => n)
                }
                let data_index = this.inputs_update[type][index][inputs] 
                if (!new_set_list.find(nsl => nsl[inputs] === data_index)) this.inputs_update[type][index][inputs] = ''
                return new_set_list
            } else if (inputs == 'working_area') {
                let set_list = this.inputs[inputs].items
                set_list = set_list.map(sl1 => {return {...sl1, working_area: sl1.kode_desa}}).filter(n => n.ta_desas.length > 0).filter(n2 => {
                    const ta_no = this.inputs_update[type][index].target_area
                    const findDesa = n2.ta_desas.find(val => val.area_code == ta_no)
                    if (findDesa) return true
                    return false
                })
                let data_index = this.inputs_update[type][index][inputs] 
                if (!set_list.find(nsl => nsl[inputs] === data_index)) this.inputs_update[type][index][inputs] = ''
                return set_list
            }
        },
        async resetData() {
            for (const[key, val] of Object.entries(this.inputs)) {
                if (key == 'active') val.model = true
                else if (key == 'birthday') val.model = moment().format('Y-MM-DD')
                else if (key != 'program_year') val.model = ''
            }
        }
    }
}
</script>