<template>
  <div>
    <v-breadcrumbs
      class="breadcrumbsmain"
      :items="itemsbr"
      divider=">"
      large
    ></v-breadcrumbs>

    <div class="mx-9">
      <v-alert :value="alerttoken" color="red" elevation="24" type="error">
        Session Token Login Habis, Login Kembali !
      </v-alert>
    </div>

    <!-- MODAL -->
    
      <!-- Modal Filter Area -->
      <v-dialog v-model="dialogFilterArea" max-width="500px" content-class="rounded-xl">
        <v-card>
          <v-card-title class="justify-center"
            >Filter Pencarian Area</v-card-title
          >
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" sm="12" md="12">
                  <v-autocomplete
                    outlined
                    rounded
                    color="green"
                    clearable
                    :menu-props="{ bottom: true, offsetY: true, rounded: 'xl', transition: 'slide-y-transition' }"
                    hide-details
                    v-model="selectMU"
                    :items="itemsMU"
                    item-value="mu_no"
                    item-text="name"
                    v-on:change="selectedMU"
                    label="Management Unit"
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12" sm="12" md="12">
                  <v-autocomplete
                    outlined
                    rounded
                    color="green"
                    clearable
                    :menu-props="{ bottom: true, offsetY: true, rounded: 'xl', transition: 'slide-y-transition' }"
                    hide-details
                    v-model="selectTA"
                    :items="itemsTA"
                    item-value="area_code"
                    item-text="name"
                    v-on:change="selectedTA"
                    label="Target Area"
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12" sm="12" md="12">
                  <v-autocomplete
                    outlined
                    rounded
                    color="green"
                    clearable
                    :menu-props="{ bottom: true, offsetY: true, rounded: 'xl', transition: 'slide-y-transition' }"
                    hide-details
                    v-model="selectVillage"
                    :items="itemsVillage"
                    item-value="kode_desa"
                    item-text="name"
                    v-on:change="selectedVillage"
                    label="Desa"
                  ></v-autocomplete>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn dark color="red" rounded class="px-5" @click="dialogFilterArea = false">
              <v-icon small class="mr-1">mdi-close-circle</v-icon>
              Cancel
            </v-btn
            >
            <v-btn color="green white--text" rounded class="px-5" @click="searchbyarea">
              <v-icon small class="mr-1">mdi-magnify</v-icon>
              Cari
            </v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Modal Filter Emp -->
      <v-dialog v-model="dialogFilterEmp" max-width="500px" content-class="rounded-xl">
        <v-card>
          <v-card-title class="justify-center"
            >Filter Pencarian By Emp</v-card-title
          >
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" sm="12" md="12">
                  <v-autocomplete
                    outlined
                    rounded
                    color="green"
                    clearable
                    :menu-props="{ bottom: true, offsetY: true, rounded: 'xl', transition: 'slide-y-transition' }"
                    hide-details
                    v-model="selectUM"
                    :items="itemsum"
                    item-value="nik"
                    item-text="name"
                    v-on:change="selectedUM"
                    label="Pilih Unit Manager"
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12" sm="12" md="12">
                  <v-autocomplete
                    outlined
                    rounded
                    color="green"
                    clearable
                    :menu-props="{ bottom: true, offsetY: true, rounded: 'xl', transition: 'slide-y-transition' }"
                    hide-details
                    v-model="selectFC"
                    :items="itemsfc"
                    item-value="nik"
                    item-text="name"
                    v-on:change="selectedFC"
                    label="Pilih Field Coordinator"
                  ></v-autocomplete>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn dark color="red" rounded class="px-5" @click="dialogFilterEmp = false">
              <v-icon small class="mr-1">mdi-close-circle</v-icon>
              Cancel
            </v-btn
            >
            <v-btn color="green white--text" rounded class="px-5" @click="searchbyemp">
              <v-icon small class="mr-1">mdi-magnify</v-icon>
              Cari
            </v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Modal Add Edit -->
      <v-dialog v-model="dialog" max-width="800px">
        <v-card>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-card-title class="mb-1 headermodalstyle">
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text class="pa-0 fontall">
              <v-container
                v-if="load == true"
                fluid
                fill-height
                style="background-color: rgba(255, 255, 255, 0.5)"
              >
                <v-layout justify-center align-center>
                  <v-progress-circular
                    :size="80"
                    :width="10"
                    indeterminate
                    color="primary"
                  >
                  </v-progress-circular>
                </v-layout>
              </v-container>
              <v-stepper v-if="load == false" v-model="e1">
                <v-stepper-header>
                  <v-stepper-step editable :complete="e1 > 1" step="1">
                    Main Data
                  </v-stepper-step>
                  <v-divider></v-divider>
                  <v-stepper-step editable :complete="e1 > 2" step="2">
                    List Pohon
                  </v-stepper-step>
                  <v-divider></v-divider>
                  <v-stepper-step editable step="3"> Foto </v-stepper-step>
                </v-stepper-header>

                <v-stepper-items>
                  <v-stepper-content class="pa-3" step="1">
                    <v-container class="mb-2">
                      <v-row>
                        <v-col cols="12" sm="6" md="6">
                          <v-select
                            v-model="defaultItem.user_id"
                            :items="itemsff"
                            item-text="name"
                            item-value="ff_no"
                            label="Pilih Field Facilitator"
                            outlined
                            clearable
                            type="string"
                            v-on:change="selectPetani"
                            :rules="[(v) => !!v || 'Field is required']"
                          ></v-select>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                          <v-text-field
                            v-model="defaultItem.lahan_no"
                            label="No Lahan"
                            outlined
                            type="string"
                            :rules="[(v) => !!v || 'Field is required']"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                          <v-select
                            v-model="defaultItem.planting_year"
                            :items="itemsTahun"
                            item-text="text"
                            item-value="value"
                            label="Pilih Tahun Program"
                            outlined
                            clearable
                            type="string"
                            :rules="[(v) => !!v || 'Field is required']"
                          ></v-select>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                          <v-text-field
                            v-model="defaultItem.total_holes"
                            label="Total Lubang"
                            outlined
                            type="number"
                            :rules="[(v) => !!v || 'Field is required']"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-container>

                    <v-row class="ma-2">
                      <v-spacer></v-spacer>
                      <v-btn
                        class="mr-1"
                        color="red"
                        elevation="1"
                        @click="close"
                        outlined
                      >
                        <v-icon left> mdi-close-circle-outline </v-icon>
                        Cancel
                      </v-btn>
                      <v-btn
                        elevation="1"
                        outlined
                        color="primary"
                        @click="e1 = 2"
                      >
                        <v-icon left>
                          mdi-chevron-right-circle-outline
                        </v-icon>
                        Next
                      </v-btn>
                    </v-row>
                  </v-stepper-content>

                  <v-stepper-content class="pa-3" step="2">
                    <v-container class="mb-2">
                      <v-row class="mb-3">
                        <h4>Pilih Pohon</h4>
                        <v-divider class="mx-2 mt-3"></v-divider>
                      </v-row>
                      <v-row>
                        <v-col class="px-1 py-0" cols="12" sm="12" md="12">
                          <v-combobox
                            :items="itemstrees"
                            item-value="tree_code"
                            item-text="tree_name"
                            label="Pilih Pohon"
                            v-on:change="changeBarangSelected"
                            outlined
                            clearable
                          ></v-combobox>
                        </v-col>
                      </v-row>
                      <v-row class="mb-3">
                        <h4>List Pohon</h4>
                        <v-divider class="mx-2 mt-3"></v-divider>
                      </v-row>
                      <v-row>
                        <v-col cols="12" sm="12" md="12">
                          <v-data-table
                            :headers="headerListProduct"
                            :items="defaultItem.list_detail"
                            class="elevation-3"
                            append-icon="mdi-magnify"
                            :items-per-page="5"
                            :loading="loadtabledetail"
                            loading-text="Loading... Please wait"
                          >
                            <template v-slot:item.actions="{ item }">
                              <v-icon
                                class="mr-2"
                                @click="deletelistitemproduct(item)"
                                color="red"
                              >
                                mdi-delete
                              </v-icon>
                              <!-- <v-icon @click="deleteItem(item)" color="red"> mdi-delete </v-icon> -->
                            </template>
                          </v-data-table>
                        </v-col>
                      </v-row>
                    </v-container>

                    <v-row class="ma-2">
                      <v-spacer></v-spacer>
                      <v-btn
                        class="mr-1"
                        color="red"
                        elevation="1"
                        @click="close"
                        outlined
                      >
                        <v-icon left> mdi-close-circle-outline </v-icon>
                        Cancel
                      </v-btn>
                      <v-btn
                        elevation="1"
                        outlined
                        color="primary"
                        @click="e1 = 3"
                      >
                        <v-icon left>
                          mdi-chevron-right-circle-outline
                        </v-icon>
                        Next
                      </v-btn>
                    </v-row>
                  </v-stepper-content>

                  <v-stepper-content class="pa-3" step="3">
                    <v-container class="mb-2">
                      <v-row>
                        <v-col cols="12" sm="4" md="4" class="pa-1">
                          <v-file-input
                            accept="image/png, image/jpeg, image/bmp"
                            placeholder="Pilih Foto"
                            prepend-icon="mdi-camera"
                            show-size
                            label="Gambar Signature"
                            outlined
                            v-model="gambarinput1"
                            v-on:change="pilihgambar1"
                          ></v-file-input>
                        </v-col>
                        <v-col cols="12" sm="4" md="4" class="pa-1">
                          <v-file-input
                            accept="image/png, image/jpeg, image/bmp"
                            placeholder="Pilih Foto"
                            prepend-icon="mdi-camera"
                            show-size
                            label="Pilih Gambar1"
                            outlined
                            v-model="gambarinput2"
                            v-on:change="pilihgambar2"
                          ></v-file-input>
                        </v-col>
                        <v-col cols="12" sm="4" md="4" class="pa-1">
                          <v-file-input
                            accept="image/png, image/jpeg, image/bmp"
                            placeholder="Pilih Foto"
                            prepend-icon="mdi-camera"
                            show-size
                            label="Pilih Gambar2"
                            outlined
                            v-model="gambarinput3"
                            v-on:change="pilihgambar3"
                          ></v-file-input>
                        </v-col>
                        <v-container>
                          <v-row>
                            <v-col cols="4" md="4">
                              <!-- <div>Foto SPPT/ Dokument</div> -->
                              <v-card
                                class="d-flex align-center"
                                elevation="2"
                                height="250"
                                width="250"
                              >
                                <v-img
                                  v-bind:src="defaultItem.gambarshow1"
                                  class="my-2 mb-4"
                                  contain
                                  max-height="225"
                                ></v-img>
                              </v-card>
                            </v-col>
                            <v-col cols="4" md="4">
                              <!-- <div>Foto SPPT/ Dokument</div> -->
                              <v-card
                                class="d-flex align-center"
                                elevation="2"
                                height="250"
                                width="250"
                              >
                                <v-img
                                  v-bind:src="defaultItem.gambarshow2"
                                  class="my-2 mb-4"
                                  max-height="225"
                                  contain
                                ></v-img>
                              </v-card>
                            </v-col>
                            <v-col cols="4" md="4">
                              <!-- <div>Foto SPPT/ Dokument</div> -->
                              <v-card
                                class="d-flex align-center"
                                elevation="2"
                                height="250"
                                width="250"
                              >
                                <v-img
                                  v-bind:src="defaultItem.gambarshow3"
                                  class="my-2 mb-4"
                                  max-height="225"
                                  contain
                                ></v-img>
                              </v-card>
                            </v-col>
                          </v-row>
                        </v-container>
                      </v-row>
                    </v-container>
                    <v-row class="ma-2">
                      <v-spacer> </v-spacer>
                      <v-btn
                        class="mr-1"
                        color="red"
                        elevation="1"
                        @click="close"
                        outlined
                      >
                        <v-icon left> mdi-close-circle-outline </v-icon>
                        Cancel
                      </v-btn>
                      <v-btn
                        color="success"
                        elevation="1"
                        outlined
                        @click="save"
                      >
                        <v-progress-circular
                          v-if="loadsave == true"
                          :size="25"
                          :width="5"
                          indeterminate
                          color="green"
                        >
                        </v-progress-circular>
                        <v-icon v-if="loadsave == false" left>
                          mdi-checkbox-marked-circle-outline
                        </v-icon>
                        <h4 v-if="loadsave == false">Save</h4>
                      </v-btn>
                    </v-row>
                  </v-stepper-content>
                </v-stepper-items>
              </v-stepper>
            </v-card-text>

            <!-- <v-card-actions v-if="load == false">
              <v-spacer></v-spacer>
              <v-btn color="red darken-1" outlined @click="close">
                Cancel
              </v-btn>
              <v-btn color="blue darken-1" outlined @click="save">
                Save
              </v-btn>
            </v-card-actions> -->
          </v-form>
        </v-card>
      </v-dialog>

      <v-dialog v-model="dialogAddonly" max-width="800px">
        <v-card>
          <v-card-title class="mb-1 headermodalstyle">
            <span class="headline">{{ formTitle }}</span>
          </v-card-title>

          <v-card-text class="pa-0 fontall">
            <v-container
              v-if="load == true"
              fluid
              fill-height
              style="background-color: rgba(255, 255, 255, 0.5)"
            >
              <v-layout justify-center align-center>
                <v-progress-circular
                  :size="80"
                  :width="10"
                  indeterminate
                  color="primary"
                >
                </v-progress-circular>
              </v-layout>
            </v-container>
            <v-stepper v-if="load == false" v-model="e1">
              <v-stepper-header>
                <v-stepper-step editable :complete="e1 > 1" step="1">
                  Main Data
                </v-stepper-step>
                <v-divider></v-divider>
                <v-divider></v-divider>
                <v-stepper-step editable step="2"> Foto </v-stepper-step>
              </v-stepper-header>

              <v-stepper-items>
                <v-stepper-content class="pa-3" step="1">
                  <v-container class="mb-2">
                    <v-row>
                      <v-col cols="12" sm="12" md="12">
                        <v-select
                          v-model="defaultItem.user_id"
                          :items="itemsff"
                          item-text="name"
                          item-value="ff_no"
                          label="Pilih Field Facilitator"
                          outlined
                          clearable
                          type="string"
                          v-on:change="selectPetani"
                          :rules="[(v) => !!v || 'Field is required']"
                        ></v-select>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-select
                          v-model="defaultItem.farmer_no"
                          :items="itemspetani"
                          item-text="nama"
                          item-value="kode"
                          label="Pilih Petani"
                          outlined
                          clearable
                          type="string"
                          v-on:change="selectLahan"
                        ></v-select>
                      </v-col>

                      <v-col cols="12" sm="6" md="6">
                        <v-select
                          v-model="defaultItem.lahan_no"
                          :items="itemslahan"
                          item-text="lahan_no"
                          item-value="lahan_no"
                          label="Pilih No Lahan"
                          outlined
                          clearable
                          type="string"
                          v-on:change="selectedLahanNo"
                          :rules="[(v) => !!v || 'Field is required']"
                        ></v-select>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-text-field
                          v-model="defaultItem.lahan_condition"
                          label="Kondisi Lahan"
                          outlined
                          required
                          :rules="[(v) => !!v || 'Field is required']"
                        ></v-text-field>
                        <!-- <v-select
                          v-model="defaultItem.lahan_condition"
                          :items="itemslahancondition"
                          item-text="text"
                          item-value="value"
                          label="Pilih Lahan Condition"
                          outlined
                          clearable
                          type="string"
                          :rules="[(v) => !!v || 'Field is required']"
                        ></v-select> -->
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <div
                          style="
                            border-style: solid;
                            padding: 3px;
                            border-color: red;
                          "
                        >
                          <h4>Jarak Lahan : {{ jarak_lahan }}</h4>
                          <h4>Akses Jangkauan : {{ akses_jangkauan }}</h4>
                        </div>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-select
                          v-model="defaultItem.planting_year"
                          :items="itemsTahun"
                          item-text="text"
                          item-value="value"
                          label="Planting Year"
                          outlined
                          clearable
                          type="string"
                          :rules="[(v) => !!v || 'Field is required']"
                        ></v-select>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-menu
                          v-model="menu1"
                          transition="scale-transition"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                              v-model="datepicker1"
                              slot="activator"
                              label="Planting Date"
                              outlined
                              readonly
                              v-bind="attrs"
                              v-on="on"
                              :rules="[(v) => !!v || 'Field is required']"
                            ></v-text-field>
                          </template>
                          <v-date-picker
                            v-model="datepicker1"
                            @input="menu1 = false"
                          ></v-date-picker>
                        </v-menu>
                      </v-col>
                    </v-row>
                    <!-- <v-row class="mb-3">
                      <h4>Pilih Pohon</h4>
                      <v-divider class="mx-2 mt-3"></v-divider>
                    </v-row>
                    <v-row>
                      <v-col class="px-1 py-0" cols="12" sm="12" md="12">
                        <v-combobox
                          :items="itemstrees"
                          item-value="tree_code"
                          item-text="tree_name"
                          label="Pilih Pohon"
                          v-on:change="changeBarangSelected"
                          outlined
                          clearable
                        ></v-combobox>
                      </v-col>
                    </v-row> -->
                    <v-row class="mb-3">
                      <h4>Detail Penilikan</h4>
                      <v-divider class="mx-2 mt-3"></v-divider>
                      <v-btn @click="adddetailpohon">Add</v-btn>
                    </v-row>
                    <v-row>
                      <v-col cols="12" sm="12" md="12">
                        <v-data-table
                          :headers="headerslistpohon"
                          :items="itemlistpohon"
                          sort-by="calories"
                          class="elevation-1"
                        >
                          <template v-slot:item.actions="{ item }">
                            <v-icon small @click="deleteItemPohon(item)">
                              mdi-delete
                            </v-icon>
                          </template>
                        </v-data-table>
                      </v-col>
                    </v-row>
                  </v-container>

                  <v-row class="ma-2">
                    <v-spacer></v-spacer>
                    <v-btn
                      class="mr-1"
                      color="red"
                      elevation="1"
                      @click="close"
                      outlined
                    >
                      <v-icon left> mdi-close-circle-outline </v-icon>
                      Cancel
                    </v-btn>
                    <v-btn
                      elevation="1"
                      outlined
                      color="primary"
                      @click="e1 = 2"
                    >
                      <v-icon left>
                        mdi-chevron-right-circle-outline
                      </v-icon>
                      Next
                    </v-btn>
                  </v-row>
                </v-stepper-content>

                <v-stepper-content class="pa-3" step="2">
                  <v-container class="mb-2">
                    <v-row>
                      <v-col cols="12" sm="4" md="4" class="pa-1">
                        <v-file-input
                          accept="image/png, image/jpeg, image/bmp"
                          placeholder="Pilih Foto"
                          prepend-icon="mdi-camera"
                          show-size
                          label="Gambar Signature"
                          outlined
                          v-model="gambarinput1"
                          v-on:change="pilihgambar1"
                        ></v-file-input>
                      </v-col>
                      <v-col cols="12" sm="4" md="4" class="pa-1">
                        <v-file-input
                          accept="image/png, image/jpeg, image/bmp"
                          placeholder="Pilih Foto"
                          prepend-icon="mdi-camera"
                          show-size
                          label="Pilih Gambar1"
                          outlined
                          v-model="gambarinput2"
                          v-on:change="pilihgambar2"
                        ></v-file-input>
                      </v-col>
                      <v-col cols="12" sm="4" md="4" class="pa-1">
                        <v-file-input
                          accept="image/png, image/jpeg, image/bmp"
                          placeholder="Pilih Foto"
                          prepend-icon="mdi-camera"
                          show-size
                          label="Pilih Gambar2"
                          outlined
                          v-model="gambarinput3"
                          v-on:change="pilihgambar3"
                        ></v-file-input>
                      </v-col>
                      <v-container>
                        <v-row>
                          <v-col cols="4" md="4">
                            <!-- <div>Foto SPPT/ Dokument</div> -->
                            <v-card
                              class="d-flex align-center"
                              elevation="2"
                              height="250"
                              width="250"
                            >
                              <v-img
                                v-bind:src="defaultItem.gambarshow1"
                                class="my-2 mb-4"
                                contain
                                max-height="225"
                              ></v-img>
                            </v-card>
                          </v-col>
                          <v-col cols="4" md="4">
                            <!-- <div>Foto SPPT/ Dokument</div> -->
                            <v-card
                              class="d-flex align-center"
                              elevation="2"
                              height="250"
                              width="250"
                            >
                              <v-img
                                v-bind:src="defaultItem.gambarshow2"
                                class="my-2 mb-4"
                                max-height="225"
                                contain
                              ></v-img>
                            </v-card>
                          </v-col>
                          <v-col cols="4" md="4">
                            <!-- <div>Foto SPPT/ Dokument</div> -->
                            <v-card
                              class="d-flex align-center"
                              elevation="2"
                              height="250"
                              width="250"
                            >
                              <v-img
                                v-bind:src="defaultItem.gambarshow3"
                                class="my-2 mb-4"
                                max-height="225"
                                contain
                              ></v-img>
                            </v-card>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-row>
                  </v-container>
                  <v-row class="ma-2">
                    <v-spacer> </v-spacer>
                    <v-btn
                      class="mr-1"
                      color="red"
                      elevation="1"
                      @click="close"
                      outlined
                    >
                      <v-icon left> mdi-close-circle-outline </v-icon>
                      Cancel
                    </v-btn>
                    <v-btn
                      color="success"
                      elevation="1"
                      outlined
                      @click="save"
                    >
                      <v-progress-circular
                        v-if="loadsave == true"
                        :size="25"
                        :width="5"
                        indeterminate
                        color="green"
                      >
                      </v-progress-circular>
                      <v-icon v-if="loadsave == false" left>
                        mdi-checkbox-marked-circle-outline
                      </v-icon>
                      <h4 v-if="loadsave == false">SaveAdd</h4>
                    </v-btn>
                  </v-row>
                </v-stepper-content>
              </v-stepper-items>
            </v-stepper>
          </v-card-text>

          <!-- <v-card-actions v-if="load == false">
              <v-spacer></v-spacer>
              <v-btn color="red darken-1" outlined @click="close">
                Cancel
              </v-btn>
              <v-btn color="blue darken-1" outlined @click="save">
                Save
              </v-btn>
            </v-card-actions> -->
        </v-card>
      </v-dialog>

      <!-- Modal Add Realisasi Tanam Lahan Umum -->
      <v-dialog v-model="dialogFormLahanUmum.model" max-width="1000px" content-class="rounded-xl mx-1" scrollable persistent>
        <v-card>
          <v-card-title class="mb-1 headermodalstyle">
            <span class="">Form Realisasi Tanam Lahan Umum</span>
          </v-card-title>

          <v-card-text>
            <v-container
              v-if="dialogFormLahanUmum.loading"
              fluid
              fill-height
              style="background-color: rgba(255, 255, 255, 0.5)"
            >
              <v-layout justify-center align-center>
                <v-progress-circular
                  :size="80"
                  :width="10"
                  indeterminate
                  color="green"
                >
                </v-progress-circular>
              </v-layout>
            </v-container>
            <v-row v-else class="my-0">
              <!-- MoU No -->
              <v-col cols="12" sm="12">
                <v-autocomplete
                  color="success"
                  item-color="success"
                  item-text="mou_no"
                  item-value="mou_no"
                  v-model="dialogFormLahanUmum.inputs.mou_no.model"
                  :items="dialogFormLahanUmum.inputs.mou_no.options"
                  @change="getSeedDetailFromDistributionAdjustment"
                  :disabled="dialogFormLahanUmum.inputs.mou_no.disabled"
                  clearable
                  outlined
                  hide-details
                  :menu-props="{ bottom: true, offsetY: true, rounded: 'xl', transition: 'slide-y-transition' }"
                  rounded
                  label="MoU No"
                  class=""
                >
                  <template v-slot:item="data">
                    <v-list-item-content>
                      <v-list-item-title v-html="data.item.mou_no"></v-list-item-title>
                      <v-list-item-subtitle>{{ data.item.pic_lahan }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </template>
                </v-autocomplete>
              </v-col>
              <v-col cols="12" class="d-flex align-center">
                  <v-btn fab x-small color="green white--text" class="mr-2"><v-icon>mdi-sprout</v-icon></v-btn> <h3>Adjusting Trees</h3><v-divider class="mx-2"></v-divider>
              </v-col>
              <v-col cols="12" md="12">
                  <v-data-table
                      :headers="dialogFormLahanUmum.inputs.adjustment.headers"
                      :items="dialogFormLahanUmum.inputs.adjustment.items"
                      :loading="dialogFormLahanUmum.inputs.adjustment.loading"
                      :items-per-page="-1"
                      hide-default-footer
                      class="rounded-xl elevation-5 overflow-hidden mt-2"
                  >
                      <template v-slot:progress>
                        <v-layout justify-center align-center>
                          <v-progress-circular
                            :size="50"
                            :width="5"
                            indeterminate
                            color="green"
                            class="my-3"
                          >
                          </v-progress-circular>
                        </v-layout>
                      </template>
                      <template v-slot:item.no="{index}">
                          {{ index + 1 }}
                      </template>
                      <template v-slot:item.total_tree_received="{item}">
                          <v-chip color="info white--text">
                            <strong class="mr-1">{{ numberFormat(item.total_tree_received) }}</strong>
                            Bibit
                          </v-chip>
                      </template>
                      <template v-slot:item.planted="{index}">
                          <v-row class="ma-0 align-center justify-end justify-lg-center flex-nowrap">
                              <v-text-field 
                                  color="green"
                                  class="mr-1 my-1"
                                  dense
                                  hide-details
                                  outlined
                                  rounded
                                  style="max-width: 120px;"
                                  type="number"
                                  min="0"
                                  label="Life"
                                  v-model="dialogFormLahanUmum.inputs.adjustment.items[index].total_tree_planted_life"
                                  @change="updateSeedlingAdjustment"
                                  @keyup="updateSeedlingAdjustment"
                                  @click="updateSeedlingAdjustment"
                              ></v-text-field>
                              <v-text-field 
                                  color="green"
                                  class="mr-1 my-1"
                                  dense
                                  hide-details
                                  outlined
                                  rounded
                                  style="max-width: 120px;"
                                  type="number"
                                  min="0"
                                  label="Dead"
                                  v-model="dialogFormLahanUmum.inputs.adjustment.items[index].total_tree_planted_dead"
                                  @change="updateSeedlingAdjustment"
                                  @keyup="updateSeedlingAdjustment"
                                  @click="updateSeedlingAdjustment"
                              ></v-text-field>
                          </v-row>
                      </template>
                      <template v-slot:item.unplanted="{index}">
                          <v-row class="ma-0 align-center justify-end justify-lg-center flex-nowrap">
                              <v-text-field 
                                  color="green"
                                  class="mr-1 my-1"
                                  dense
                                  hide-details
                                  outlined
                                  rounded
                                  style="max-width: 120px;"
                                  type="number"
                                  min="0"
                                  label="Life"
                                  v-model="dialogFormLahanUmum.inputs.adjustment.items[index].total_tree_unplanted_life"
                                  @change="updateSeedlingAdjustment"
                                  @keyup="updateSeedlingAdjustment"
                                  @click="updateSeedlingAdjustment"
                              ></v-text-field>
                              <v-text-field 
                                  color="green"
                                  class="mr-1 my-1"
                                  dense
                                  hide-details
                                  outlined
                                  rounded
                                  style="max-width: 120px;"
                                  type="number"
                                  min="0"
                                  label="Dead"
                                  v-model="dialogFormLahanUmum.inputs.adjustment.items[index].total_tree_unplanted_dead"
                                  @change="updateSeedlingAdjustment"
                                  @keyup="updateSeedlingAdjustment"
                                  @click="updateSeedlingAdjustment"
                              ></v-text-field>
                          </v-row>
                      </template>
                      <template v-slot:item.lost="{item}">
                          <v-chip color="red white--text">
                            <strong class="mr-1">{{ numberFormat(item.lost) }}</strong>
                            Bibit
                          </v-chip>
                      </template>
                  </v-data-table>
              </v-col>
              <v-col cols="12" class="d-flex align-center">
                  <v-btn fab x-small color="green white--text" class="mr-2"><v-icon>mdi-forest</v-icon></v-btn> <h3>Land Data</h3><v-divider class="mx-2"></v-divider>
              </v-col>
              <!-- Lahan Condition -->
              <v-col cols="12" sm="12" md="6" lg="4">
                <v-text-field 
                    color="green"
                    hide-details
                    outlined
                    rounded
                    label="Land Condition"
                    v-model="dialogFormLahanUmum.inputs.land_condition"
                ></v-text-field>
              </v-col>
              <!-- Standard Trees Amount -->
              <v-col cols="12" sm="12" md="6" lg="4">
                <v-text-field 
                    color="green"
                    hide-details
                    outlined
                    rounded
                    type="number"
                    min="0"
                    label="Standard Trees Amount"
                    v-model="dialogFormLahanUmum.inputs.qty_std"
                ></v-text-field>
              </v-col>
              <!-- Planting Date -->
              <v-col cols="12" md="6" lg="4" class="text-center">
                  <v-menu v-model="dialogFormLahanUmum.inputs.planting_date.datepicker.show" offset-x transition="slide-x-transition" rounded="xl">
                      <template v-slot:activator="{ on, attrs }">
                          <p class="mb-0"><strong>{{ dialogFormLahanUmum.inputs.planting_date.label }}</strong></p>
                          <v-btn 
                              rounded class=""
                              color="green white--text"
                              v-bind="attrs"
                              v-on="on"
                          >
                              {{ dateFormat(dialogFormLahanUmum.inputs.planting_date.model, 'ddd, DD MMMM Y') }}
                          </v-btn>
                      </template>
                      <div>
                          <v-date-picker
                              v-model="dialogFormLahanUmum.inputs.planting_date.model"
                              min="2022-11-24"
                              max="2023-01-31"
                              @input="dialogFormLahanUmum.inputs.planting_date.datepicker.show = false"
                              color="green"
                              class="rounded-xl"
                              :key="dialogFormLahanUmum.inputs.planting_date.datepicker.key"
                          ></v-date-picker>
                      </div>
                  </v-menu>
              </v-col>
              <v-col cols="12" class="d-flex align-center">
                  <v-btn fab x-small color="green white--text" class="mr-2"><v-icon>mdi-image-multiple</v-icon></v-btn> <h3>Photos</h3><v-divider class="mx-2"></v-divider>
              </v-col>
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
                  label="Living Plant (*max 6mb)"
                  v-on:change="photo1FileChanged"
                  :rules="[(v) => !!v || 'Field is required']"
                  ></v-file-input>
                  <v-card elevation="2" class="rounded-xl" height="300" v-if="dialogFormLahanUmum.inputs.photo1.preview && dialogFormLahanUmum.inputs.photo1.preview !== ''">
                      <v-img
                          height="300"
                          v-bind:src="dialogFormLahanUmum.inputs.photo1.preview"
                          class="my-2 mb-4 rounded-xl cursor-pointer"
                          id="photo1"
                          @click="showLightbox(dialogFormLahanUmum.inputs.photo1.preview)"
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
                  label="Dead Plant (*max 6mb)"
                  v-on:change="photo2FileChanged"
                  :rules="[(v) => !!v || 'Field is required']"
                  ></v-file-input>
                  <v-card elevation="2" class="rounded-xl" height="300" v-if="dialogFormLahanUmum.inputs.photo2.preview && dialogFormLahanUmum.inputs.photo2.preview !== ''">
                      <v-img
                          height="300"
                          v-bind:src="dialogFormLahanUmum.inputs.photo2.preview"
                          class="my-2 mb-4 rounded-xl cursor-pointer"
                          id="photo2"
                          @click="showLightbox(dialogFormLahanUmum.inputs.photo2.preview)"
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
                  label="Seeds haven't planted (*max 6mb)"
                  v-on:change="photo3FileChanged"
                  :rules="[(v) => !!v || 'Field is required']"
                  ></v-file-input>
                  <v-card elevation="2" class="rounded-xl" height="300" v-if="dialogFormLahanUmum.inputs.photo3.preview && dialogFormLahanUmum.inputs.photo3.preview !== ''">
                      <v-img
                          height="300"
                          v-bind:src="dialogFormLahanUmum.inputs.photo3.preview"
                          class="my-2 mb-4 rounded-xl cursor-pointer"
                          id="photo3"
                          @click="showLightbox(dialogFormLahanUmum.inputs.photo3.preview)"
                      ></v-img
                  ></v-card>
              </v-col>
            </v-row>
          </v-card-text>

          <v-card-actions v-if="dialogFormLahanUmum.loading == false">
            <v-btn color="red white--text" rounded @click="dialogFormLahanUmum.model = false">
              <v-icon class="mr-1">mdi-close-circle</v-icon>
              Cancel
            </v-btn>
            <v-divider class="mx-2"></v-divider>
            <v-btn color="blue white--text" rounded 
              :disabled="
                dialogFormLahanUmum.inputs.qty_std < 1 ||
                !dialogFormLahanUmum.inputs.photo1.model ||
                !dialogFormLahanUmum.inputs.mou_no.model ||
                dialogFormLahanUmum.inputs.adjustment.items.length == 0 ||
                !dialogFormLahanUmum.inputs.planting_date.model
              "
              @click="dialogFormLahanUmum.confirm = true"
            >
              <v-icon class="mr-1">mdi-check-circle</v-icon>
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialogFormLahanUmum.confirm" max-width="500px" content-class="rounded-xl">
        <v-card>
          <v-card-title class="justify-center">
            Are you sure you want to SAVE? <small class="red--text">This can't be undone!</small>
          </v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn class="pr-3" color="red white--text" rounded @click="dialogFormLahanUmum.confirm = false">
              <v-icon class="mr-1">mdi-close-circle</v-icon>
              Cancel
            </v-btn>
            <v-btn
              color="green white--text"
              class="pr-3"
              rounded
              @click="saveLahanUmumMonitoring"
            >
              <v-icon class="mr-1">mdi-check-circle</v-icon>
              OK, SAVE
            </v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="dialogPohon" max-width="500px">
        <v-card>
          <v-card-title>
            <span class="text-h5">Daftar Pohon</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" sm="12" md="12">
                  <v-combobox
                    v-model="tree_temp"
                    :items="itemstrees"
                    item-text="tree_name"
                    item-value="tree_code"
                    label="Pilih Pohon"
                    outlined
                    clearable
                    type="string"
                    :rules="[(v) => !!v || 'Field is required']"
                  ></v-combobox>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    v-model="editedItemPohon.qty"
                    label="Jumlah"
                    outlined
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-menu v-model="menu4" transition="scale-transition">
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="datepicker4"
                        slot="activator"
                        label="Planting Date"
                        v-bind="attrs"
                        v-on="on"
                        outlined
                        :rules="[(v) => !!v || 'Field is required']"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="datepicker4"
                      @input="menu4 = false"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-select
                    v-model="editedItemPohon.status"
                    :items="itemsstatustrees"
                    item-text="text"
                    item-value="value"
                    label="Pilih Status"
                    outlined
                    clearable
                    type="string"
                    :rules="[(v) => !!v || 'Field is required']"
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-select
                    v-model="editedItemPohon.condition"
                    :items="itemscoditiontrees"
                    item-text="text"
                    item-value="value"
                    label="Pilih Kondisi"
                    outlined
                    clearable
                    type="string"
                    :rules="[(v) => !!v || 'Field is required']"
                  ></v-select>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="closePohonTambah">
              Cancel
            </v-btn>
            <v-btn color="blue darken-1" text @click="savePohon">
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="dialogDeletePohon" max-width="500px">
        <v-card>
          <v-card-title class="text-h5"
            >Are you sure you want to delete this item?</v-card-title
          >
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="closeDeletePohon"
              >Cancel</v-btn
            >
            <v-btn
              color="blue darken-1"
              text
              @click="deleteItemConfirmPohon"
              >OK</v-btn
            >
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Modal Add Product -->
      <v-dialog v-model="dialogAddProduct" max-width="500px">
        <v-card>
          <v-card-text class="pa-1 fontall">
            <v-container>
              <v-row>
                <v-col cols="12" sm="12" md="12">
                  <v-combobox
                    v-model="trees_add_temp"
                    :items="itemstrees"
                    item-text="tree_name"
                    item-value="tree_code"
                    label="Pilih Pohon"
                    outlined
                    clearable
                    type="string"
                    :rules="[(v) => !!v || 'Field is required']"
                  ></v-combobox>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="pb-1" cols="12" sm="6" md="6">
                  <v-text-field
                    v-model="jumlah_temp"
                    label="Jumlah"
                    outlined
                    type="number"
                    required
                  ></v-text-field>
                </v-col>
                <v-col class="pb-1" cols="12" sm="6" md="6">
                  <v-menu v-model="menu2" transition="scale-transition">
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="datepicker2"
                        slot="activator"
                        label="Planting Date"
                        outlined
                        readonly
                        v-bind="attrs"
                        v-on="on"
                        :rules="[(v) => !!v || 'Field is required']"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="datepicker2"
                      @input="menu2 = false"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" sm="6" md="6">
                  <v-select
                    v-model="status_temp"
                    :items="itemsstatustrees"
                    item-text="text"
                    item-value="value"
                    label="Pilih Status"
                    outlined
                    clearable
                    type="string"
                    :rules="[(v) => !!v || 'Field is required']"
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-select
                    v-model="condition_temp"
                    :items="itemscoditiontrees"
                    item-text="text"
                    item-value="value"
                    label="Pilih Kondisi"
                    outlined
                    clearable
                    type="string"
                    :rules="[(v) => !!v || 'Field is required']"
                  ></v-select>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="red"
              elevation="1"
              outlined
              @click="canceladdproduk"
            >
              <v-icon left> mdi-close-circle-outline </v-icon>
              Cancel
            </v-btn>
            <v-btn
              color="success"
              elevation="1"
              outlined
              @click="addProduct"
            >
              <v-icon left> mdi-plus-circle-outline </v-icon>
              Add
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="dialogShowEdit" max-width="500px">
        <v-card>
          <v-card-title class="headline"
            >What you want to edit?</v-card-title
          >
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn outlined color="blue" text @click="showEditModal"
              >Edit Sosialisasi</v-btn
            >
            <v-btn
              outlined
              color="green"
              text
              @click="showEditJumlahPohonModal"
              >Jumlah Pohon</v-btn
            >
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="dialogDetailPohon" max-width="500px">
        <v-card>
          <v-card-title class="headline"
            ><span class="headline">Detail Pohon Lahan</span></v-card-title
          >
          <v-card-text>
            <v-row class="mt-3">
              <v-col cols="12" sm="12" md="12">
                <div>
                  <h3 class="ml-1">
                    <v-data-table
                      :headers="headersdetaileditjumlah"
                      :items="DetailTreesLahanTemp"
                      class="elevation-1"
                    >
                      <!-- <template v-slot:item.tree_category="{ item }">
                        {{ gettype(item.tree_category) }}
                      </template> -->
                      <template v-slot:item.actions="{ item }">
                        <v-icon
                          v-if="RoleAccesCRUDShow == true"
                          class="mr-3"
                          @click="editDetailPohon(item)"
                          small
                          color="warning"
                        >
                          mdi-pencil
                        </v-icon>
                        <v-icon
                          v-if="RoleAccesCRUDShow == true"
                          @click="deleteDetailPohon(item)"
                          small
                          color="red"
                        >
                          mdi-delete
                        </v-icon>
                      </template>
                    </v-data-table>
                  </h3>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn outlined color="red" text @click="closeDetailPohon"
              >Cancel</v-btn
            >
            <v-btn outlined color="blue" text @click="saveEditPohon"
              >Save</v-btn
            >
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="dialogDetailPohonEdit" max-width="300px">
        <v-card>
          <v-card-text>
            <v-row class="mt-7">
              <v-col cols="12" sm="12" md="12">
                <v-text-field
                  v-model="editedItemPohon.amount"
                  label="Jumlah Pohon"
                  outlined
                  type="number"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn outlined color="red" text @click="closeDetailEditPohon"
              >Cancel</v-btn
            >
            <v-btn outlined color="blue" text @click="saveEditPohonTemp"
              >Save</v-btn
            >
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Modal Detail -->
      <v-dialog v-model="dialogDetail" max-width="1000px" content-class="rounded-xl" scrollable>
        <v-card>
          <v-card-title class="mb-1 headermodalstyle">
            <span class="">Detail Realisasi Tanam</span>
          </v-card-title>
          <v-card-text>
            <v-container
              v-if="load == true"
              fluid
              fill-height
              style="background-color: rgba(255, 255, 255, 0.5)"
            >
              <v-layout justify-center align-center>
                <v-progress-circular
                  :size="80"
                  :width="10"
                  indeterminate
                  color="green"
                >
                </v-progress-circular>
              </v-layout>
            </v-container>
            <v-container v-if="load == false">
              <v-row>
                <v-col cols="12">
                  <v-simple-table>
                    <template v-slot:default>
                      <tbody>
                        <tr>
                          <th
                            class="text-left"
                            style="width: 200px; font-size: 14px"
                          >
                            Tahun Program
                          </th>
                          <td class="text-left" style="font-size: 14px">
                            <strong>{{ defaultItem.planting_year }}</strong>
                          </td>
                        </tr>
                        <tr>
                          <th
                            class="text-left"
                            style="width: 200px; font-size: 14px"
                          >
                            Monitoring No
                          </th>
                          <td class="text-left" style="font-size: 14px">
                            <strong>{{ defaultItem.monitoring_no }}</strong>
                          </td>
                        </tr>
                        <tr>
                          <th class="text-left" style="font-size: 14px">
                            Nama FF
                          </th>
                          <td class="text-left" style="font-size: 14px">
                            <strong>{{ defaultItem.nama_ff }}</strong>
                          </td>
                        </tr>
                        <tr>
                          <th class="text-left" style="font-size: 14px">
                            Nama Petani
                          </th>
                          <td class="text-left" style="font-size: 14px">
                            <strong>{{ defaultItem.nama_petani }}</strong>
                          </td>
                        </tr>
                        <tr>
                          <th class="text-left" style="font-size: 14px">
                            No Lahan
                          </th>
                          <td class="text-left" style="font-size: 14px">
                            <strong v-if="defaultItem.lahan_no">{{ defaultItem.lahan_no.replace('[', '').replace(']', '') }}</strong>
                          </td>
                        </tr>
                        <tr>
                          <th class="text-left" style="font-size: 14px">
                            Kondisi Lahan
                          </th>
                          <td class="text-left" style="font-size: 14px">
                            <strong style="text-transform: capitalize">
                              {{ defaultItem.lahan_condition.replace('_', ' ') }}
                            </strong>
                          </td>
                        </tr>
                        <tr>
                          <th class="text-left" style="font-size: 14px">
                            Pohon Sesuai Standar
                          </th>
                          <td class="text-left" style="font-size: 14px">
                            <strong>{{ defaultItem.qty_std || 0 }}</strong>
                          </td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                  <div>
                    <h4 class="mt-3 mb-2"><v-icon>mdi-sprout</v-icon> Jenis dan Jumlah Bibit</h4>
                    <h3 class="ml-1">
                      <!-- <v-data-table
                        :headers="headersdetail"
                        :items="defaultItem.list_detail"
                        class="elevation-1"
                      > -->
                        <!-- <template v-slot:item.tree_category="{ item }">
                              {{ gettype(item.tree_category) }}
                            </template> -->
                      <!-- </v-data-table> -->
                      <v-simple-table dense class="rounded-xl overflow-hidden" style="border: 1px solid #e2e2e2;border-collapse: collapse;">
                        <thead>
                          <tr>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th colspan="2" class="text-center">Ditanam</th>
                            <th colspan="2" class="text-center">Belum Ditanam</th>
                            <th></th>
                          </tr>
                          <tr>
                            <th class="text-center">No</th>
                            <th>Category</th>
                            <th>Name</th>
                            <th class="text-center">Hidup</th>
                            <th class="text-center">Mati</th>
                            <th class="text-center">Hidup</th>
                            <th class="text-center">Mati</th>
                            <th class="text-center">Hilang</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(seed, seedIndex) in defaultItem.list_detail" :key="seedIndex">
                            <td class="text-center">{{ seedIndex + 1 }}</td>
                            <td>{{ seed.tree_category }}</td>
                            <td>{{ seed.tree_name }}</td>
                            <td class="text-center">
                              <v-text-field 
                                color="green"
                                type="number"
                                min="0"
                                outlined
                                hide-details
                                dense
                                rounded
                                :readonly="(User.role_name == 'FIELD FACILITATOR' && defaultItem.is_validate > 0) || (User.role_name == 'UNIT MANAGER' && defaultItem.is_validate != 1) || defaultItem.is_validate == 2"
                                v-model="defaultItem.list_detail[seedIndex].seedling.ditanam.hidup"></v-text-field>
                            </td>
                            <td class="text-center">
                              <v-text-field 
                                color="green"
                                type="number"
                                min="0"
                                outlined
                                hide-details
                                dense
                                rounded
                                :readonly="(User.role_name == 'FIELD FACILITATOR' && defaultItem.is_validate > 0) || (User.role_name == 'UNIT MANAGER' && defaultItem.is_validate != 1) || defaultItem.is_validate == 2"
                                v-model="defaultItem.list_detail[seedIndex].seedling.ditanam.mati"></v-text-field>
                            </td>
                            <td class="text-center">
                              <v-text-field 
                                color="green"
                                type="number"
                                min="0"
                                outlined
                                hide-details
                                dense
                                rounded
                                :readonly="(User.role_name == 'FIELD FACILITATOR' && defaultItem.is_validate > 0) || (User.role_name == 'UNIT MANAGER' && defaultItem.is_validate != 1) || defaultItem.is_validate == 2"
                                v-model="defaultItem.list_detail[seedIndex].seedling.blm_ditanam.hidup"></v-text-field>
                            </td>
                            <td class="text-center">
                              <v-text-field 
                                color="green"
                                type="number"
                                min="0"
                                outlined
                                hide-details
                                dense
                                rounded
                                :readonly="(User.role_name == 'FIELD FACILITATOR' && defaultItem.is_validate > 0) || (User.role_name == 'UNIT MANAGER' && defaultItem.is_validate != 1) || defaultItem.is_validate == 2"
                                v-model="defaultItem.list_detail[seedIndex].seedling.blm_ditanam.mati"></v-text-field>
                            </td>
                            <td class="text-center">
                              <v-text-field 
                                color="green"
                                type="number"
                                min="0"
                                outlined
                                hide-details
                                dense
                                rounded
                                :readonly="(User.role_name == 'FIELD FACILITATOR' && defaultItem.is_validate > 0) || (User.role_name == 'UNIT MANAGER' && defaultItem.is_validate != 1) || defaultItem.is_validate == 2"
                                v-model="defaultItem.list_detail[seedIndex].seedling.hilang"></v-text-field>
                            </td>
                          </tr>
                        </tbody>
                      </v-simple-table>
                    </h3>
                  </div>
                </v-col>
                <v-col cols="12">
                  <div class="text-center mb-2"><v-icon>mdi-image-multiple</v-icon> Photos</div>
                  <v-row>
                    <v-col cols="12" lg="4">
                      <v-img
                        height="250"
                        v-bind:src="defaultItem.gambarshow1"
                        @click="showLightbox(defaultItem.gambarshow1)"
                        class="my-1 mb-4 rounded-xl cursor-pointer"
                      ></v-img>
                    </v-col>
                    <v-col cols="12" lg="4">
                      <v-img
                        height="250"
                        v-bind:src="defaultItem.gambarshow2"
                        @click="showLightbox(defaultItem.gambarshow2)"
                        class="my-1 mb-4 rounded-xl cursor-pointer"
                      ></v-img>
                    </v-col>
                    <v-col cols="12" lg="4">
                      <v-img
                        height="250"
                        v-bind:src="defaultItem.gambarshow3"
                        @click="showLightbox(defaultItem.gambarshow3)"
                        class="my-1 mb-4 rounded-xl cursor-pointer"
                      ></v-img>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions v-if="load == false">
            <v-spacer></v-spacer>
            <v-btn
              v-if="RoleAccesCRUDShow == true && defaultItem.is_validate == 0 && User.role_name != 'UNIT MANAGER'"
              rounded
              color="green white--text"
              class="pr-3"
              @click="verifSubmit()"
              elevation="1"
            >
              <v-icon class="mr-1">mdi-check-circle</v-icon> Verification FC
            </v-btn>
            <v-btn
              v-else-if="RoleAccesCRUDShow == true && defaultItem.is_validate == 1 && User.role_name != 'FIELD COORDINATOR'"
              rounded
              @click="dialogVerificationUM = true"
              color="green white--text"
              class="pr-3"
              elevation="1"
            >
              <v-icon class="mr-1">mdi-check-circle</v-icon> Verification UM
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="dialogCetakPilihan" max-width="500px">
        <v-card>
          <v-card-title class="headline"
            >What you want to print?</v-card-title
          >
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn outlined color="blue" text @click="showPrintLabel()"
              >Print Label</v-btn
            >
            <v-btn
              outlined
              color="green"
              text
              @click="showPrintTandaTerima()"
              >Tanda Terima</v-btn
            >
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Modal Verification -->
      <v-dialog v-model="dialogVerification" max-width="500px" content-class="rounded-xl">
        <v-card>
          <v-card-title class="justify-center">
            Are you sure you want to VERIFICATION? <small class="red--text">This can't be undone!</small>
          </v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn class="pr-3" color="red white--text" rounded @click="closeVerification">
              <v-icon class="mr-1">mdi-close-circle</v-icon>
              Cancel
            </v-btn>
            <v-btn
              color="green white--text"
              class="pr-3"
              rounded
              @click="VerificationItemConfirm"
            >
              <v-icon class="mr-1">mdi-check-circle</v-icon>
              OK, Verify
            </v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialogVerificationUM" max-width="500px" content-class="rounded-xl">
        <v-card>
          <v-card-title class="justify-center">
            Are you sure you want to VERIFICATION? <small class="red--text">This can't be undone!</small>
          </v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn class="pr-3" color="red white--text" rounded @click="dialogVerificationUM = false">
              <v-icon class="mr-1">mdi-close-circle</v-icon>
              Cancel
            </v-btn>
            <v-btn
              color="green white--text"
              class="pr-3"
              rounded
              @click="VerificationUMItemConfirm"
            >
              <v-icon class="mr-1">mdi-check-circle</v-icon>
              OK, Verify
            </v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Modal Unverif -->
      <v-dialog v-model="dialogUnverif" max-width="500px" content-class="rounded-xl">
        <v-card>
          <v-card-title class="justify-center text-center"
            >Are you sure you want to <br> UNVERIFICATION <br> this data monitoring 1?</v-card-title
          >
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn class="pr-3" color="red white--text" rounded @click="dialogUnverif = false">
              <v-icon class="mr-1">mdi-close-circle</v-icon>
              Cancel
            </v-btn>
            <v-btn
              color="warning white--text"
              class="pr-3"
              rounded
              @click="unverifItemConfirm"
            >
              <v-icon class="mr-1 pl-2">mdi-undo</v-icon>
              Yes, Unverif
            </v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>
    <!-- END: MODAL -->

    <v-data-table
      :headers="generalSettings.landProgram.model == 'Petani' ? headers : headers2"
      :items="dataobject"
      :search="search"
      :loading="loadtable"
      :options.sync="pagination.options"
      :server-items-length="pagination.total"
      :page="pagination.current_page"
      loading-text="Loading... Please wait"
      class="rounded-xl elevation-6 mx-3 pa-1"
      multi-sort
      :footer-props="{
        itemsPerPageOptions: [10, 20, 30, 40, -1],
        showCurrentPage: true,
        showFirstLastPage: true,
      }"
    >
      <template v-slot:top>
        <v-row class="ma-0 mt-2 mr-2 align-center">
          <v-menu offset-y content-class="rounded-xl" v-if="generalSettings.landProgram.model == 'Petani' && (User.role_group == 'IT' || User.role_name == 'PROGRAM MANAGER' || User.role_name == 'REGIONAL MANAGER' || User.role_name == 'UNIT MANAGER' || User.role_name == 'PLANNING MANAGER')">
            <template v-slot:activator="{attrs, on}">
              <v-btn  v-bind="attrs" v-on="on" rounded color="warning white--text" class="d-none d-md-block ml-2">
                <v-icon class="mr-1">mdi-filter</v-icon>
                Filter
              </v-btn>
            </template>
            <v-card class="d-flex flex-column align-stretch justify-center pa-2 py-3">
              <v-btn
                dark
                rounded
                class="mx-1 d-none d-md-block mb-2"
                @click="showFilterArea()"
                color="green"
              >
                <v-icon class="mx-2" small>mdi-filter-variant</v-icon> Filter by
                Area
              </v-btn>
              <v-btn
                v-if="RoleAccesFilterShow == true"
                dark
                rounded
                class="mx-1 d-none d-md-block"
                @click="showFilterEmployee()"
                color="green"
              >
                <v-icon class="mx-2" small>mdi-image-filter-none</v-icon> Filter by
                Employee
              </v-btn>
            </v-card>
          </v-menu>
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
              class="mx-auto mx-lg-2 mr-lg-1 mb-2 mb-lg-0"
              style="max-width: 200px"
          ></v-select>
          <!-- Land Program -->
          <v-select
              color="success"
              item-color="success"
              v-model="generalSettings.landProgram.model"
              :items="generalSettings.landProgram.items"
              outlined
              dense
              hide-details
              :menu-props="{ bottom: true, offsetY: true, rounded: 'xl', transition: 'slide-y-transition' }"
              rounded
              :label="generalSettings.landProgram.label"
              class="mx-auto mx-lg-2 mr-lg-1 mb-2 mb-lg-0"
              style="max-width: 200px"
          ></v-select>
          <v-divider class="mx-2 d-none d-md-block"></v-divider>
          <!-- Select Search Field -->
          <v-select
            color="success"
            item-color="success"
            v-model="pagination.search.field"
            :items="pagination.search.options.column"
            item-value="value"
            item-text="text"
            hide-details
            outlined
            dense
            :menu-props="{ bottom: true, offsetY: true, rounded: 'xl', transition: 'slide-y-transition' }"
            rounded
            label="Kolom Search"
            class="centered-select"
            style="width: 50%;max-width: 200px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;"
          ></v-select>
          <!-- Search Input -->
          <v-text-field
            v-if="pagination.search.field != 'is_validate'"
            color="success"
            item-color="success"
            v-model="pagination.search.value"
            append-icon="mdi-magnify"
            outlined
            dense
            rounded
            label="Search"
            hide-details
            style="border-top-left-radius: 0px;border-bottom-left-radius: 0px;"
            :loading="pagination.search.options.column_loading"
          ></v-text-field>
          <v-select
            v-else
            color="success"
            item-color="success"
            v-model="pagination.search.value"
            :items="pagination.search.options.validation"
            item-value="value"
            item-text="text"
            hide-details
            outlined
            dense
            :menu-props="{ bottom: true, offsetY: true, rounded: 'xl', transition: 'slide-y-transition' }"
            rounded
            label="Status"
            class="centered-select"
            style="border-top-left-radius: 0px;border-bottom-left-radius: 0px;"
          ></v-select>
          <v-btn
            v-if="generalSettings.landProgram.model == 'Petani'"
            rounded
            class="mx-auto mx-lg-0 ml-lg-2 mt-1 mt-lg-0"
            @click="() => {}"
            :disabled="true"
            color="info white--text"
          >
            <v-icon class="mr-1">mdi-microsoft-excel</v-icon> Export
          </v-btn>
          <v-btn
            v-if="generalSettings.landProgram.model == 'Umum'"
            dark
            rounded
            class="mx-auto mx-lg-0 ml-lg-2 mt-1 mt-lg-0"
            @click="showAddModal()"
            color="green"
          >
            <v-icon small>mdi-plus</v-icon> Add
          </v-btn>
        </v-row>
      </template>

      <!-- index column -->
      <template v-slot:item.index="{item, index}">
        <span v-if="loadtable == false">
          {{ index + 1 + ((pagination.current_page - 1) * pagination.per_page) }}
        </span>
      </template>

      <!-- No Lahan Column -->
      <template v-slot:item.lahan_no="{item}">
        <v-chip v-if="item.lahan_no.replace('[', '').replace(']', '').split(',').length < 2" class="green white--text ma-1">
          {{ item.lahan_no.replace('[', '').replace(']', '').split(',')[0] }}
        </v-chip>
        <v-menu v-else open-on-hover offset-x :close-on-content-click="false" content-class="rounded-xl" >
          <template v-slot:activator="{attrs, on}">
            <v-btn rounded small v-bind="attrs" v-on="on" color="info white--text">
              {{ item.lahan_no.replace('[', '').replace(']', '').split(',').length }} Lahan
            </v-btn>
          </template>
          <v-card class="pa-2 pb-1 d-flex flex-column">
            <v-chip 
              v-for="(lahan, lahanIndex) in item.lahan_no.replace('[', '').replace(']', '').split(',')" 
              :key="lahanIndex"
              color="green white--text"
              class="mb-1"
              style="cursor: auto"
            >
              {{ lahan }}
            </v-chip>
          </v-card>
        </v-menu>
      </template>

      <!-- Lahan Condition Column -->
      <template v-slot:item.lahan_condition="{ item }">
        <span style="text-transform: capitalize">
          {{ item.lahan_condition.replace('_', ' ') }}
        </span>
      </template>

      <!-- KAYU Column -->
      <template v-slot:item.kayu_hidup="{ item }">
        <v-row class="ma-0">
          <v-col cols="4" class="pa-0 ma-0 d-flex flex-column align-center justify-center">
              <small class="">HIDUP</small>
              <!-- <v-icon class="mr-1">mdi-sprout</v-icon> -->
              <strong>{{ item.kayu_hidup }}</strong>
          </v-col>
          <v-col cols="4" class="pa-0 px-4 ma-0 d-flex flex-column align-center justify-center">
              <small class="">MATI</small>
              <!-- <v-icon class="mr-1">mdi-sprout</v-icon> -->
              <strong>{{ item.kayu_mati }}</strong>
          </v-col>
          <v-col cols="4" class="pa-0 ma-0 d-flex flex-column align-center justify-center">
              <small class="">HILANG</small>
              <!-- <v-icon class="mr-1">mdi-sprout</v-icon> -->
              <strong>{{ item.kayu_hilang }}</strong>
          </v-col>
        </v-row>
      </template>

      <!-- MPTS Column -->
      <template v-slot:item.mpts_hidup="{ item }">
        <v-row class="ma-0">
          <v-col cols="4" class="pa-0 ma-0 d-flex flex-column align-center justify-center">
              <small class="">HIDUP</small>
              <!-- <v-icon class="mr-1">mdi-sprout</v-icon> -->
              <strong>{{ item.mpts_hidup }}</strong>
          </v-col>
          <v-col cols="4" class="pa-0 px-4 ma-0 d-flex flex-column align-center justify-center">
              <small class="">MATI</small>
              <!-- <v-icon class="mr-1">mdi-sprout</v-icon> -->
              <strong>{{ item.mpts_mati }}</strong>
          </v-col>
          <v-col cols="4" class="pa-0 ma-0 d-flex flex-column align-center justify-center">
              <small class="">HILANG</small>
              <!-- <v-icon class="mr-1">mdi-sprout</v-icon> -->
              <strong>{{ item.mpts_hilang }}</strong>
          </v-col>
        </v-row>
      </template>

      <!-- Status Column -->
      <template v-slot:item.is_validate="{ item }">
        <v-chip :color="item.is_validate > 0 ? `${ item.is_validate == 1 ? 'warning' : 'green' }` : 'red'" class="white--text pl-1">
          <v-icon class="mr-1">mdi-{{ item.is_validate > 0 ? `${ item.is_validate == 2 ? 'checkbox-multiple-marked' : 'check'}` : 'close' }}-circle</v-icon>
          {{ item.is_validate > 0 ? `Verified ${item.is_validate == 1 ? 'FC' : 'UM'}` : 'Unverified' }}
        </v-chip>
      </template>
      
      <!-- Action Column -->
      <template v-slot:item.actions="{ item }">
        <v-menu content-class="rounded-xl">
          <template v-slot:activator="{attrs, on}">
            <v-btn v-bind="attrs" v-on="on" small fab icon>
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>
          <v-card class="pa-2 d-flex align-stretch flex-column justify-center">
            <v-btn color="info white--text" rounded small class="pl-1" @click="showDetail(item)">
              <v-icon class="mr-1">mdi-information</v-icon> Detail
            </v-btn>
            <v-btn rounded small color="red white--text" class="mt-2 pl-1" v-if="item.is_validate > 0 && (User.role_group == 'IT' || ((item.is_validate < 2 && User.role_name == 'UNIT MANAGER') || (item.is_validate == 2 && User.role_name == 'REGIONAL MANAGER')))" @click="showUnverifModal(item)">
              <v-icon class="mr-1 pl-2">mdi-undo</v-icon> Unverification
            </v-btn>
          </v-card>
        </v-menu>
      </template>
    </v-data-table>

    <v-snackbar
      v-model="snackbar"
      :color="colorsnackbar"
      :timeout="timeoutsnackbar"
      rounded="xl"
      class="d-flex"
    >
      <div class="d-flex justify-between">
          <p class="mb-0">
              {{ textsnackbar }}
          </p>
          <v-spacer></v-spacer>
          <v-icon small class="pl-1" @click="snackbar = false">mdi-close-circle</v-icon>
      </div>
    </v-snackbar>
  </div>
</template>

<script>
// import ModalFarmer from "./ModalFarmer";
import axios from "axios";
import moment from 'moment'
// import BaseUrl from "../../services/BaseUrl.js";

export default {
  name: "PenilikanTanam",
  authtoken: "",
  data: () => ({
    generalSettings: {
        programYear: '2022',
        landProgram: {
          items: ['Petani', 'Umum'],
          label: 'Land Program',
          model: 'Petani',
        },
    },
    pagination: {
      current_page: 1,
      length_page: 0,
      options: {
        itemsPerPage: 20
      },
      page_options: [],
      per_page: 20,
      search: {
        field: '',
        options: {
          column: [],
          column_loading: false,
          validation: [{
            text: 'All',
            value: ''
          },{
            text: 'Unverified',
            value: 0
          }, {
            text: 'Verified FC',
            value: 1
          }, {
            text: 'Verified UM',
            value: 2
          }]
        },
        value: ''
      },
      total: 0,
    },
    dialogFormLahanUmum: {
      confirm: false,
      model: false,
      inputs: {
        mou_no: {
          model: null,
          options: []
        },
        lahan_no: null,
        land_condition: '',
        adjustment: {
          headers: [
            {text: 'No', value: 'no', align: 'center', sortable: false},
            {text: 'Category', value: 'tree_category', align: 'center'},
            {text: 'Name', value: 'tree_name'},
            {text: 'Received', value: 'total_tree_received'},
            {text: 'Planted', value: 'planted', align: 'center', sortable: false},
            {text: 'Unplanted', value: 'unplanted', align: 'center', sortable: false},
            {text: 'Lost', value: 'lost', align: 'center', sortable: true},
          ],
          items: [],
          loading: false,
          totalAdjustment: 0
        },
        photo1: {
          model: null,
          preview: null
        },
        photo2: {
          model: null,
          preview: null
        },
        photo3: {
          model: null,
          preview: null
        },
        planting_date: {
          datepicker: {
            show: false,
            key: 84846
          },
          label: 'Planting Date',
          model: ''
        },
        qty_std: 0
      },
      loading: false
    },
    alerttoken: false,
    datepicker1: new Date().toISOString().substr(0, 10),
    datepicker2: new Date().toISOString().substr(0, 10),
    datepicker3: new Date().toISOString().substr(0, 10),
    elevations: [6, 12, 18],
    itemsbr: [
      {
        text: "Activities",
        disabled: true,
        href: "breadcrumbs_dashboard",
      },
      {
        text: "Realisasi Tanam",
        disabled: true,
        href: "breadcrumbs_link_1",
      },
    ],
    e1: 1,
    stepperdone: false,
    User: [],
    datepicker: new Date().toISOString().substr(0, 10),
    datepicker4: new Date().toISOString().substr(0, 10),
    menu1: "",
    menu2: "",
    menu3: "",
    menu4: "",
    dialogAddonly: false,
    dialog: false,
    dialogUnverif: false,
    dialogDetail: false,
    dialogFilterArea: false,
    dialogFilterEmp: false,
    dialogShowEdit: false,
    dialogDetailPohon: false,
    dialogDetailPohonEdit: false,
    dialogAddProduct: false,
    dialogCetakPilihan: false,
    dialogdownload: false,
    loadtable: false,
    loadtabledetail: false,
    load: false,
    loadsave: false,
    downloadvalueff: false,
    downloadvaluepetani: false,
    downloadvaluetime: false,
    loaddownload: false,
    formTitle: "Add Item",
    value: "add",
    search: "",
    type: "",
    headers: [
      { text: "No", value: "index", align: 'center', width: '2%', sortable: false },
      { text: "MU", value: "mu_name", search: true },
      { text: "FF", value: "nama_ff", search: true },
      { text: "Farmer", value: "nama_petani", search: true },
      { text: "Lahan No", align: "start", value: "lahan_no", sortable: false, search: true },
      { text: "Standard Trees", value: "qty_std", align: 'center', sortable: false },
      { text: "KAYU", value: "kayu_hidup", align: 'center', sortable: false },
      { text: "MPTS", value: "mpts_hidup", align: 'center', sortable: false },
      { text: "Status", value: "is_validate", align: 'center', search: true },
      { text: "Actions", value: "actions", align: 'right', sortable: false },
    ],
    headers2: [
      { text: "MU", value: "mu_name" },
      { text: "PIC T4T", value: "employee_name" },
      { text: "PIC Lahan", value: "pic_lahan" },
      { text: "Lahan No", align: "start", value: "lahan_no", sortable: false },
      { text: "Condition", value: "lahan_condition" },
      { text: "Status", value: "is_validate", align: 'center' },
      { text: "Actions", value: "actions", align: 'right', sortable: false },
    ],

    headersdetail: [
      { text: "Nama Pohon", value: "tree_name", width: "20%" },
      { text: "Jumlah", value: "qty", width: "15%" },
      { text: "Kondisi", value: "condition", width: "15%" },
      { text: "Status", value: "status", width: "15%" },
    ],
    headersdetaileditjumlah: [
      { text: "Nama Pohon", value: "tree_name", width: "20%" },
      { text: "Kategori", value: "tree_category", width: "20%" },
      { text: "Jumlah", value: "amount", width: "15%" },
      { text: "Actions", value: "actions", sortable: false, width: "15%" },
    ],
    headerListProduct: [
      { text: "Nama Pohon", value: "tree_name", width: "35%" },
      { text: "Jumlah", value: "qty", width: "15%" },
      { text: "Status", value: "status", width: "15%" },
      { text: "Kondisi", value: "condition", width: "15%" },
      { text: "planting_date", value: "planting_date", width: "25%" },
      { text: "Actions", value: "actions", sortable: false, width: "10%" },
    ],
    DetailTreesLahanTemp: [],
    dataobject: [],
    editedItem: {
      name: "",
    },
    defaultItem: {
      id: "",
      monitoring_no: "",
      farmer_no: "",
      farmer_no: "",
      lahan_no: "",
      lahan_condition: "",
      planting_year: "2021",
      planting_date: "",
      gambar1: "",
      gambar2: "",
      gambar3: "",
      qty_kayu: "",
      qty_mpts: "",
      qty_crops: "",
      qty_std: '',
      validate_by: "",
      validate_name: "",
      is_validate: "",
      user_id: "",
      nama_ff: "",
      user_id: "FF000001",
      nama_petani: "",
      waitingapproval: false,

      gambarshow1: "",
      gambarshow2: "",
      gambarshow3: "",
      fileUpload_files: "",
      fileUploadReady_files: false,
      fileUpload1: "",
      fileUploadReady_gambar1: false,
      fileUpload2: "",
      fileUploadReady_gambar2: false,
      fileUpload3: "",
      fileUploadReady_gambar3: false,
      list_detail: [],
    },
    itemsTahun: [
      { text: "2019", value: "2019" },
      { text: "2020", value: "2020" },
      { text: "2021", value: "2021" },
      { text: "2022", value: "2022" },
      { text: "2023", value: "2023" },
      { text: "2024", value: "2024" },
      { text: "2025", value: "2025" },
      { text: "2026", value: "2026" },
    ],
    itemsstatustrees: [
      { text: "Sudah Ditanam", value: "sudah_ditanam" },
      { text: "Belum Ditanam", value: "belum_ditanam" },
    ],
    itemscoditiontrees: [
      { text: "Hidup", value: "hidup" },
      { text: "Sakit", value: "sakit" },
      { text: "Mati", value: "mati" },
      { text: "Hilang", value: "hilang" },
    ],
    // itemsdownload: [
    //   { text: "Output All Data", value: "output_data" },
    //   { text: "Loading Plan", value: "loading_plan" },
    //   { text: "Packing Plan", value: "packing_plan" },
    //   { text: "Shipping Plan", value: "shipping_plan" },
    //   { text: "Farmer Receipt", value: "farmer_receipt" },
    // ],

    itemslahan: [],
    itemsum: [],
    itemsfc: [],
    itemsff: [],
    itemspetani: [],
    itemsethnic: [],
    itemsjob: [],
    itemstrees: [],
    itemsgroupfarmer: [],
    itemsMU: [],
    itemsTA: [],
    itemsVillage: [],
    valueMU: "",
    valueTA: "",
    valueVillage: "",
    valueUM: "",
    valueFC: "",
    selectUM: "",
    selectFC: "",
    selectMU: "",
    selectTA: "",
    selectVillage: "",
    itemsTAForm: [],
    itemsVillageForm: [],
    valueMUForm: "",
    valueTAForm: "",
    valueVillageForm: "",
    valueFFcode: "",
    selectMUForm: "",
    selectTAForm: "",
    valueFFForm: "",
    selectVillageForm: "",
    BaseUrlGet: "",
    dialogVerification: false,
    dialogVerificationUM: false,
    fc_no_global: "",
    typegetdata: "",

    itemspetanidownload: "",
    itemsdistribusidownload: "",
    selectFFdownload: "",
    selectpetanidownload: "",
    selectdistribusitimedownload: "",

    gambarinput1: "",
    gambarinput2: "",
    gambarinput3: "",

    filephotoarray: [],

    valid: true,
    BaseUrlUpload: "",
    BaseUrl: "",
    RoleAccesFilterShow: true,
    RoleAccesDownloadAllShow: true,
    RoleAccesCRUDShow: true,
    RoleAccesPrintLabelShow: true,
    RoleAccesIT: false,

    valuedownloadselected: "",
    valueMUExcel: "",
    valueTAExcel: "",
    valueVillageExcel: "",
    typegetdataExcel: "",
    valueFFcodeExcel: "",

    valuePetaniselected: "",
    valueLahanselected: "",

    trees_add_temp: "",
    tree_code_temp: "",
    tree_name_temp: "",
    tree_category_temp: "",
    jumlah_temp: "",
    planting_date_temp: "",
    status_temp: "",
    condition_temp: "",
    max_value_pohon_temp: 0,

    jarak_lahan: "",
    akses_jangkauan: "",

    snackbar: false,
    textsnackbar: "Test",
    timeoutsnackbar: 2000,
    colorsnackbar: null,

    employee_no: "",
    itemTemp: "",

    max_kayu: 15,
    max_mpts: 6,
    max_crops: 5,

    jumlahPohonTemp: 0,
    idPohonTemp: 0,
    editedIndexPohon: -1,
    editedItemPohon: {
      amount: "",
      detail_year: "",
      id: "",
      lahan_no: "",
      tree_category: "",
      tree_code: "",
      tree_name: "",
    },

    headerListProduct: [
      { text: "Nama Pohon", value: "tree_name", width: "35%" },
      { text: "Jumlah", value: "qty", width: "15%" },
      { text: "Status", value: "status", width: "15%" },
      { text: "Kondisi", value: "condition", width: "15%" },
      { text: "planting_date", value: "planting_date", width: "25%" },
      { text: "Actions", value: "actions", sortable: false, width: "10%" },
    ],

    itemlistpohon: [],
    dialogPohon: false,
    dialogDeletePohon: false,
    headerslistpohon: [
      {
        text: "Nama Pohon",
        align: "start",
        sortable: false,
        value: "tree_name",
      },
      { text: "Jummlah", value: "qty" },
      { text: "Status", value: "status" },
      { text: "Kondisi", value: "condition" },
      { text: "Planting Date", value: "planting_date" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    // itemlistanak: [],
    editedIndexPohon: -1,
    editedItemPohon: {
      tree_code: "",
      tree_name: "",
      qty: 0,
      status: "-",
      condition: "-",
      planting_date: "-",
    },
    defaultItemPohon: {
      tree_code: "",
      tree_name: "",
      qty: 0,
      status: "-",
      condition: "-",
      planting_date: "-",
    },
    tree_temp: "",

    ph_form_no_temp: "",
  }),
  computed: {
    // formTitle() {
    //   return this.editedIndex === -1 ? "New Item" : "Edit Item";
    // },
  },
  async mounted() {

    await this.firstAccessPage();

    const taskForceEmails = this.$store.state.taskForceTeam.emails || []
    
    // if (this.User.role_group != 'IT' && taskForceEmails.includes(this.User.email) == false) {
    // if (this.User.role_group != 'IT') {
    //   this.$store.state.maintenanceOverlay = true
    // }
  },
  destroyed() {
    this.$store.state.maintenanceOverlay = false

    this.$store.state.loadingOverlay = false
    this.$store.state.loadingOverlayText = null
  },

  watch: {
    'generalSettings.programYear': {
      handler(newVal) {
        this.initialize()
      }
    },
    'generalSettings.landProgram.model': {
      handler() {
        this.dataobject = []
        this.initialize()
      }
    },
    'pagination.options': {
        handler(newValue) {
          let {page, itemsPerPage, sortBy} = newValue
          this.pagination.current_page = page
          this.pagination.per_page = itemsPerPage
          this.initialize()
        },
        deep: true
    },
    'pagination.search.value': {
        handler() {
          this.initialize()
        },
        deep: true
    },
  },

  methods: {
    firstAccessPage() {
      this.authtoken = localStorage.getItem("token");
      this.User = JSON.parse(localStorage.getItem("User"));
      this.valueFFcode = this.User.ff.ff;
      this.typegetdata = this.User.ff.value_data == '-' ? 'all' : this.User.ff.value_data;
      this.BaseUrlGet = localStorage.getItem("BaseUrlGet");
      this.BaseUrl = localStorage.getItem("BaseUrl");
      this.employee_no = this.User.employee_no;
      this.generalSettings.programYear = this.$store.state.programYear.model
      // this.fc_no_global = this.User.fc.fc;
      this.checkRoleAccess();
      this.initialize();
      this.getMU();
      //   this.getEthnic();
      //   this.getJob();
      this.getFF();
      this.getUMAll();
      this.getTrees();
      this.BaseUrlUpload = localStorage.getItem("BaseUrlUpload");
    },
    checkRoleAccess() {
      if (this.User.role_group == "IT") {
        this.RoleAccesCRUDShow = true;
        this.RoleAccesFilterShow = true;
        this.RoleAccesDownloadAllShow = true;
        this.RoleAccesPrintLabelShow = true;
        this.RoleAccesIT = true;
      } else if (this.User.role_group == "FIELD") {
        if (this.User.role == "19") {
          this.RoleAccesCRUDShow = true;
          this.RoleAccesFilterShow = false;
          this.RoleAccesDownloadAllShow = false;
          this.RoleAccesPrintLabelShow = false;
          this.RoleAccesIT = false;
        } else if (this.User.role == "20") {
          this.RoleAccesCRUDShow = true;
          this.RoleAccesFilterShow = false;
          this.RoleAccesDownloadAllShow = true;
          this.RoleAccesPrintLabelShow = true;
          this.RoleAccesIT = false;
        } else if (this.User.role == "14") {
          this.RoleAccesCRUDShow = true;
          this.RoleAccesFilterShow = true;
          this.RoleAccesDownloadAllShow = true;
          this.RoleAccesPrintLabelShow = false;
          this.RoleAccesIT = false;
        } else {
          this.RoleAccesCRUDShow = false;
          this.RoleAccesFilterShow = true;
          this.RoleAccesDownloadAllShow = true;
          this.RoleAccesPrintLabelShow = true;
          this.RoleAccesIT = false;
        }
      } else {
        if (this.User.role == "19" || this.User.role == "20") {
          this.RoleAccesCRUDShow = true;
          this.RoleAccesFilterShow = false;
          this.RoleAccesPrintLabelShow = false;
          this.RoleAccesIT = false;
        } else {
          this.RoleAccesCRUDShow = false;
          this.RoleAccesFilterShow = true;
          this.RoleAccesPrintLabelShow = false;
          this.RoleAccesIT = false;
        }
      }
    },
    getColorStatus(status) {
      if (status == "Belum Verifikasi") return "red";
      else return "green";
    },
    async getSeedDetailFromDistributionAdjustment(mou_no) {
      if (mou_no) {
        this.dialogFormLahanUmum.inputs.adjustment.loading = true
        const url = `${this.BaseUrlGet}GetUmumDistributionDetailReport?distribution_no=D-${this.generalSettings.programYear}-${mou_no}`
        await axios.get(url, this.$store.state.apiConfig).then(res => {
            const datas = res.data.data.result
            console.log(datas)
            let listLahan = []
            let listTrees = []
            datas.distributionAdjustment.forEach((adj, adjIndex) => {
                let checkExistLahanNo = listLahan.includes(adj.lahan_no)
                if (!checkExistLahanNo) listLahan.push(adj.lahan_no)
  
                const pushData = {
                  tree_code: adj.tree_code,
                  tree_category: adj.tree_category,
                  tree_name: adj.tree_name,
                  total_tree_received: parseInt(adj.total_tree_received),
                  total_tree_planted_life: 0,
                  total_tree_planted_dead: 0,
                  total_tree_unplanted_life: 0,
                  total_tree_unplanted_dead: 0,
                  lost: parseInt(adj.total_tree_received),
                }
                const indexTreee = listTrees.findIndex(tr => tr.tree_code === adj.tree_code)
                if (indexTreee > -1) {
                  listTrees[indexTreee].total_tree_received += parseInt(adj.total_tree_received)
                  listTrees[indexTreee].lost += parseInt(adj.total_tree_received)
                } else listTrees.push(pushData)
            })
            console.log(listLahan)
            console.log(listTrees)
            this.dialogFormLahanUmum.inputs.adjustment.items = listTrees
        }).catch(err => {
          this.dialogFormLahanUmum.inputs.adjustment.items = []
          if (err.response.status == 401) {
            localStorage.removeItem("token")
            this.$router.push("/")
          }
        }).finally(() => {
          this.dialogFormLahanUmum.inputs.adjustment.loading = false
        })
      } else this.dialogFormLahanUmum.inputs.adjustment.items = []
    },
    async getLahanUmumDataOptions() {
      const url = this.BaseUrlGet + 'GetUmumDistributionReport?'
      const params ={
          program_year: this.generalSettings.programYear,
          distribution_date: '2022-12-29'
      }
      if (this.User.role_group != 'IT' && this.User.role_name != 'PROGRAM MANAGER' && this.User.role_name != 'REGIONAL MANAGER') {
          params.created_by = this.User.email
      }
      await axios.get(`${url}${new URLSearchParams(params)}`, this.$store.state.apiConfig)
      .then(res => {
        console.log(res.data.data.result)
        let verifiedLahanUmum = []
        res.data.data.result.forEach((val) => {
          if (val.status == 2) {
            verifiedLahanUmum.push(val)
          }
        })
        this.dialogFormLahanUmum.inputs.mou_no.options = verifiedLahanUmum
      }).catch(err => {
        this.dialogFormLahanUmum.inputs.mou_no.options = []
        if (err.response.status == 401) {
          localStorage.removeItem("token")
          this.$router.push("/")
        }
      })
    },
    async initialize() {
      this.loadtable = true;
      // console.log(this.User.ff.ff);
      try {
        this.loadtable = true;
        this.$store.state.loadingOverlayText = 'Getting monitoring datas...'
        this.$store.state.loadingOverlay = true

        // get search column
        await this.getSearchColumn()
        
        await this.getTableData().then(data => {
          this.dataobject = data.items
          this.pagination.total = data.total
          this.pagination.current_page = data.current_page
          this.pagination.length_page = data.last_page
          const pageOptions = []
          for (let index = 1; index <= data.last_page; index++) {
            pageOptions.push(index)          
          }
          this.pagination.page_options = pageOptions
          // console.log(this.pagination)
        })
      } catch (error) {
        console.error(error);
        if (error.response.status == 401) {
          localStorage.removeItem("token");
          this.$router.push("/");
          this.loadtable = false;
        } else {
          this.dataobject = [];
          this.loadtable = false;
        }
      } finally {
        this.$store.state.loadingOverlay = false
        this.$store.state.loadingOverlayText = null
        this.loadtable = false
      }
    },
    getTableData() {
      return new Promise((resolve, reject) => {
        let url = this.BaseUrlGet
        let params = {
          program_year: this.generalSettings.programYear,
          // pagination
          page: this.pagination.current_page,
          per_page: this.pagination.per_page,
          sortBy: this.pagination.options.sortBy || '',
          sortDesc: this.pagination.options.sortDesc || '',

          search_column: this.pagination.search.field || '',
          search_value: this.pagination.search.value || '',
          
          mu: this.valueMU,
          ta: this.valueTA,
          village: this.valueVillage,
          typegetdata: this.typegetdata,
          ff: this.valueFFcode
        }
        if (this.generalSettings.landProgram.model == 'Petani') {
          url += "GetMonitoringAdmin?" + new URLSearchParams(params)
        } else if (this.generalSettings.landProgram.model == 'Umum') {
          delete params.ff
          delete params.ta
          if (this.User.role_group != 'IT' && this.User.role_name != 'PROGRAM MANAGER' && this.User.role_name != 'REGIONAL MANAGER') {
            params.created_at = this.User.email
          }
          url += 'GetMonitoringAdminLahanUmum?' + new URLSearchParams(params)
        }
        // get data response
        axios.get(url, this.$store.state.apiConfig).then(res => {
          if (typeof res.data.data.result !== 'undefined') {
            let items = res.data.data.result.data
            const total = res.data.data.result.total
            const current_page = res.data.data.result.current_page
            const last_page = res.data.data.result.last_page
            resolve({
              items,
              total,
              current_page,
              last_page
            })
          } else {
            reject('Error')
          }
        }).catch(err => {
          if (err.response.status == 401) {
            localStorage.removeItem("token")
            this.$router.push("/")
            this.loadtable = false
          }
          reject(err)
        })
      })
    },
    async getSearchColumn() {
      let headerItems = []
      let searchOptions = []
      if (this.generalSettings.landProgram.model == 'Petani') headerItems = this.headers
      else if (this.generalSettings.landProgram.model == 'Umum') headerItems = this.headers2
      await headerItems.forEach(val => {
        if (val.search == true) searchOptions.push(val)
      })
      this.pagination.search.options.column = searchOptions
      if (!this.pagination.search.field) this.pagination.search.field = 'mu_name'
    },

    async saveLahanUmumMonitoring() {
      try {
        this.dialogFormLahanUmum.confirm = false
        this.dialogFormLahanUmum.model = false
        this.$store.state.loadingOverlay = true
        this.$store.state.loadingOverlayText = 'Saving monitoring lahan umum...'
        const url = `${this.BaseUrlGet}CreateMonitoringLahanUmum`
        let dataForPost = {
          program_year: this.generalSettings.programYear,
          mou_no: this.dialogFormLahanUmum.inputs.mou_no.model,
          planting_date: this.dialogFormLahanUmum.inputs.planting_date.model,
          qty_std: this.dialogFormLahanUmum.inputs.qty_std,
          land_condition: this.dialogFormLahanUmum.inputs.land_condition,
          created_by: this.User.email,
          list_trees: []
        }
        // set list trees
        await this.dialogFormLahanUmum.inputs.adjustment.items.forEach(val => {
          if (parseInt(val.total_tree_planted_life) > 0) dataForPost.list_trees.push({
            tree_code: val.tree_code,
            qty: parseInt(val.total_tree_planted_life),
            status: 'sudah_ditanam',
            condition: 'hidup'
          })
          if (parseInt(val.total_tree_planted_dead) > 0) dataForPost.list_trees.push({
            tree_code: val.tree_code,
            qty: parseInt(val.total_tree_planted_dead),
            status: 'sudah_ditanam',
            condition: 'mati'
          })
          if (parseInt(val.total_tree_unplanted_life) > 0) dataForPost.list_trees.push({
            tree_code: val.tree_code,
            qty: parseInt(val.total_tree_unplanted_life),
            status: 'belum_ditanam',
            condition: 'hidup'
          })
          if (parseInt(val.total_tree_unplanted_dead) > 0) dataForPost.list_trees.push({
            tree_code: val.tree_code,
            qty: parseInt(val.total_tree_unplanted_dead),
            status: 'belum_ditanam',
            condition: 'mati'
          })
          if (parseInt(val.lost) > 0) dataForPost.list_trees.push({
            tree_code: val.tree_code,
            qty: parseInt(val.lost),
            status: 'hilang',
            condition: 'hilang'
          })
        })
        // upload photo 1
        if (this.dialogFormLahanUmum.inputs.photo1.model) {
          const photo1 = await this.uploadPhotos('photo1', this.dialogFormLahanUmum.inputs.photo1.model)
          dataForPost.photo1 = photo1
        } else if (this.dialogFormLahanUmum.inputs.photo1.preview) {
          dataForPost.photo1 = this.dialogFormLahanUmum.inputs.photo1.preview.replace(this.BaseUrl, '')
        }
        // upload photo 2
        if (this.dialogFormLahanUmum.inputs.photo2.model) {
          const photo2 = await this.uploadPhotos('photo2', this.dialogFormLahanUmum.inputs.photo2.model)
          dataForPost.photo2 = photo2
        } else if (this.dialogFormLahanUmum.inputs.photo2.preview) {
          dataForPost.photo2 = this.dialogFormLahanUmum.inputs.photo2.preview.replace(this.BaseUrl, '')
        }
        // upload photo 3
        if (this.dialogFormLahanUmum.inputs.photo3.model) {
          const photo3 = await this.uploadPhotos('photo3', this.dialogFormLahanUmum.inputs.photo3.model)
          dataForPost.photo3 = photo3
        } else if (this.dialogFormLahanUmum.inputs.photo3.preview) {
          dataForPost.photo3 = this.dialogFormLahanUmum.inputs.photo3.preview.replace(this.BaseUrl, '')
        }
        console.log(dataForPost)
        const store = await axios.post(url, dataForPost, this.$store.state.apiConfig)
        if (store) {
          this.textsnackbar = "Success store monitoring lahan umum data!"
          this.colorsnackbar = 'green'
        } else {
          this.textsnackbar = "Failed store monitoring lahan umum data!"
          this.colorsnackbar = 'red'
        }
      } catch (err) {
        if (err.response.status == 401) {
          this.textsnackbar = "Unaunthicated!"
          this.colorsnackbar = 'red'
          localStorage.removeItem("token")
          this.$router.push("/")
        } else {
          this.textsnackbar = err.response.message
          this.colorsnackbar = 'red'
        }
        console.error(err)
      } finally {
        this.timeoutsnackbar = 5000
        this.snackbar = true
        this.$store.state.loadingOverlayText = null
        this.$store.state.loadingOverlay = false
      }
    },

    async getMU() {
      try {
        const response = await axios.get(
          this.BaseUrlGet + "GetManagementUnit",
          {
            headers: {
              Authorization: `Bearer ` + this.authtoken,
            },
          }
        );
        // console.log(response.data.data.result);
        if (response.data.length != 0) {
          this.itemsMU = response.data.data.result;
          // this.dataobject = response.data.data.result;
        } else {
          console.log("Kosong");
        }
      } catch (error) {
        console.error(error.response);
        if (error.response.status == 401) {
          localStorage.removeItem("token");
          this.$router.push("/");
        }
      }
    },
    async getTA(val) {
      var valparam = "";
      if (val == "table") {
        valparam = this.valueMU;
      } else {
        valparam = this.valueMUForm;
      }
      try {
        const response = await axios.get(
          this.BaseUrlGet + "GetTargetArea?mu_no=" + valparam,
          {
            headers: {
              Authorization: `Bearer ` + this.authtoken,
            },
          }
        );
        // console.log(response.data.data.result);
        if (response.data.length != 0) {
          if (val == "table") {
            this.itemsTA = response.data.data.result;
          } else {
            this.itemsTAForm = response.data.data.result;
          }
          // this.dataobject = response.data.data.result;
        } else {
          console.log("Kosong");
        }
      } catch (error) {
        console.error(error.response);
        if (error.response.status == 401) {
          localStorage.removeItem("token");
          this.$router.push("/");
        }
      }
    },
    async getVillage(val) {
      var valparam = "";
      if (val == "table") {
        valparam = this.valueTA;
      } else {
        valparam = this.valueTAForm;
      }
      try {
        const response = await axios.get(
          this.BaseUrlGet + "GetDesa?kode_ta=" + valparam,
          {
            headers: {
              Authorization: `Bearer ` + this.authtoken,
            },
          }
        );
        // console.log(response.data.data.result);
        if (response.data.length != 0) {
          if (val == "table") {
            this.itemsVillage = response.data.data.result;
          } else {
            this.itemsVillageForm = response.data.data.result;
          }
          // this.dataobject = response.data.data.result;
        } else {
          console.log("Kosong");
        }
      } catch (error) {
        console.error(error.response);
        if (error.response.status == 401) {
          localStorage.removeItem("token");
          this.$router.push("/");
        }
      }
    },
    async getTrees() {
      try {
        const response = await axios.get(this.BaseUrlGet + "GetTreesAll", {
          headers: {
            Authorization: `Bearer ` + this.authtoken,
          },
        });
        // console.log(response.data.data.result);
        if (response.data.length != 0) {
          this.itemstrees = response.data.data.result.data;
          // this.dataobject = response.data.data.result;
        } else {
          console.log("Kosong");
        }
      } catch (error) {
        console.error(error.response);
        if (error.response.status == 401) {
          localStorage.removeItem("token");
          this.$router.push("/");
        }
      }
    },
    async getFF() {
      if (this.User.fc.fc) {
        this.fc_no_global = this.User.fc.fc;
      }
      try {
        const response = await axios.get(
          this.BaseUrlGet + "GetFieldFacilitatorAll?fc_no=" + this.fc_no_global,
          {
            headers: {
              Authorization: `Bearer ` + this.authtoken,
            },
          }
        );
        // console.log(response.data.data.result);
        if (response.data.length != 0) {
          this.itemsff = response.data.data.result.data;
          this.loaddownload = false;
          // this.dataobject = response.data.data.result;
        } else {
          console.log("Kosong");
          this.loaddownload = false;
        }
      } catch (error) {
        console.error(error.response);
        if (error.response.status == 401) {
          localStorage.removeItem("token");
          this.$router.push("/");
        }
        this.loaddownload = false;
      }
    },
    async getDetail(item) {
      this.load = true;
      try {
        const response = await axios.get(
          this.BaseUrlGet +
            "GetMonitoringDetail?monitoring_no=" +
            item.monitoring_no,
          {
            headers: {
              Authorization: `Bearer ` + this.authtoken,
            },
          }
        );
        // console.log(response.data.data.result);
        if (response.data.length != 0) {
          this.defaultItem = Object.assign({}, response.data.data.result.data);
          this.defaultItem.list_detail = await this.setGroupingDetailSeedling(response.data.data.result.list_detail);
          this.itemlistpohon = response.data.data.result.list_detail;
          this.max_value_pohon_temp =
            response.data.data.result.count_list_pohon;
          this.defaultItem.waitingapproval = this.waitingapprovefunct(
            response.data.data.result.data.is_validate
          );

          if (response.data.data.result.data.gambar1 == "-") {
            this.defaultItem.gambarshow1 = "/images/noimage.png";
          } else {
            this.defaultItem.gambarshow1 =
              this.BaseUrl + response.data.data.result.data.gambar1;
          }
          console.log(this.defaultItem.gambarshow1);
          if (response.data.data.result.data.gambar2 == "-") {
            this.defaultItem.gambarshow2 = "/images/noimage.png";
          } else {
            this.defaultItem.gambarshow2 =
              this.BaseUrl + response.data.data.result.data.gambar2;
          }
          if (response.data.data.result.data.gambar3 == "-") {
            this.defaultItem.gambarshow3 = "/images/noimage.png";
          } else {
            this.defaultItem.gambarshow3 =
              this.BaseUrl + response.data.data.result.data.gambar3;
          }

          this.load = false;

          if (this.type == "Detail") {
            this.load = false;
          } else {
            this.selectPetani(response.data.data.result.data.user_id);
            this.defaultItem.farmer_no =
              response.data.data.result.data.farmer_no;
            this.selectLahan(response.data.data.result.data.farmer_no);
            this.defaultItem.lahan_no = response.data.data.result.data.lahan_no;
            this.selectedLahanNo(response.data.data.result.data.lahan_no);
            this.datepicker1 = response.data.data.result.data.planting_date;
          }

          this.load = false;
          //   this.defaultItem.kode = response.data.data.result.farmer_no;
        } else {
          console.log("Kosong");
          this.load = false;
        }
      } catch (error) {
        console.error(error.response);
        if (error.response.status == 401) {
          localStorage.removeItem("token");
          this.$router.push("/");
          this.load = false;
        }
      }
    },
    async verif() {
      let listTrees = []
      await this.defaultItem.list_detail.forEach(tree => {
        if (parseInt(tree.seedling.ditanam.hidup) > 0) {
          listTrees.push({
            monitoring_no: this.defaultItem.monitoring_no,
            tree_code: tree.tree_code,
            qty: parseInt(tree.seedling.ditanam.hidup),
            status: 'sudah_ditanam',
            condition: 'hidup',
            planting_date: this.defaultItem.planting_date,
          })
        }
        if (parseInt(tree.seedling.ditanam.mati) > 0) {
          listTrees.push({
            monitoring_no: this.defaultItem.monitoring_no,
            tree_code: tree.tree_code,
            qty: parseInt(tree.seedling.ditanam.mati),
            status: 'sudah_ditanam',
            condition: 'mati',
            planting_date: this.defaultItem.planting_date,
          })
        }
        if (parseInt(tree.seedling.blm_ditanam.hidup) > 0) {
          listTrees.push({
            monitoring_no: this.defaultItem.monitoring_no,
            tree_code: tree.tree_code,
            qty: parseInt(tree.seedling.blm_ditanam.hidup),
            status: 'belum_ditanam',
            condition: 'hidup',
            planting_date: this.defaultItem.planting_date,
          })
        }
        if (parseInt(tree.seedling.blm_ditanam.mati) > 0) {
          listTrees.push({
            monitoring_no: this.defaultItem.monitoring_no,
            tree_code: tree.tree_code,
            qty: parseInt(tree.seedling.blm_ditanam.mati),
            status: 'belum_ditanam',
            condition: 'mati',
            planting_date: this.defaultItem.planting_date,
          })
        }
        if (parseInt(tree.seedling.hilang) > 0) {
          listTrees.push({
            monitoring_no: this.defaultItem.monitoring_no,
            tree_code: tree.tree_code,
            qty: parseInt(tree.seedling.hilang),
            status: 'hilang',
            condition: 'hilang',
            planting_date: this.defaultItem.planting_date,
          })
        }
      })
      // console.log(listTrees)
      const datapost = {
        monitoring_no: this.defaultItem.monitoring_no,
        validate_by: this.User.email,
        list_trees: listTrees
      };
      // this.dialogDetail = false;
      try {
        this.dialogDetail = false
        this.dialogVerification = false
        this.$store.state.loadingOverlayText = 'Verifying monitoring by FC...'
        this.$store.state.loadingOverlay = true

        const response = await axios.post(
          this.BaseUrlGet + "ValidateMonitoring",
          datapost,
          {
            headers: {
              Authorization: `Bearer ` + this.authtoken,
            },
          }
        );
        console.log(response.data.data.result);
        if (response.data.data.result == "success") {
          this.initialize();
          this.snackbar = true
          this.textsnackbar = 'Success!'
          this.timeoutsnackbar = 5000
          this.colorsnackbar = 'green'
        } else {
          this.alerttoken = true;
        }
      } catch (error) {
        this.textsnackbar = error.message
        this.timeoutsnackbar = 5000
        this.colorsnackbar = 'red'
        if (error.response.status == 401) {
          this.alerttoken = true;
          localStorage.removeItem("token");
          this.$router.push("/");
        }
      } finally {
        this.snackbar = true
        this.$store.state.loadingOverlay = false
        this.$store.state.loadingOverlayText = null
      }
    },

    async getUMAll() {
      // if (this.User.fc.fc) {
      //   this.fc_no_global = this.User.fc.fc;
      // }
      try {
        const response = await axios.get(
          this.BaseUrlGet + "GetEmployeebyPosition?position_code=20",
          {
            headers: {
              Authorization: `Bearer ` + this.authtoken,
            },
          }
        );
        // console.log(response.data.data.result);
        if (response.data.length != 0) {
          this.itemsum = response.data.data.result.data;
          // this.dataobject = response.data.data.result;
        } else {
          console.log("Kosong");
        }
      } catch (error) {
        console.error(error.response);
        if (error.response.status == 401) {
          localStorage.removeItem("token");
          this.$router.push("/");
        }
      }
    },
    async getEmpFCbyManager(valcodeum) {
      // if (this.User.fc.fc) {
      //   this.fc_no_global = this.User.fc.fc;
      // }
      try {
        const response = await axios.get(
          this.BaseUrlGet +
            "GetEmployeebyManager?manager_code=" +
            valcodeum +
            "&position=19",
          {
            headers: {
              Authorization: `Bearer ` + this.authtoken,
            },
          }
        );
        // console.log(response.data.data.result);
        if (response.data.length != 0) {
          this.itemsfc = response.data.data.result.data;
          // this.dataobject = response.data.data.result;
        } else {
          console.log("Kosong");
        }
      } catch (error) {
        console.error(error.response);
        if (error.response.status == 401) {
          localStorage.removeItem("token");
          this.$router.push("/");
        }
      }
    },
    async GetFFbyUMandFC(position, valcode) {
      try {
        const response = await axios.get(
          this.BaseUrlGet +
            "GetFFbyUMandFC?position=" +
            position +
            "&code=" +
            valcode,
          {
            headers: {
              Authorization: `Bearer ` + this.authtoken,
            },
          }
        );
        // console.log(response.data.data.result);
        if (response.data.length != 0) {
          this.valueFFcode = response.data.data.result.data;
          // this.dataobject = response.data.data.result;
        } else {
          console.log("Kosong");
        }
      } catch (error) {
        this.valueFFcode = "";
        console.error(error.response);
        if (error.response.status == 401) {
          localStorage.removeItem("token");
          this.$router.push("/");
        }
      }
      console.log(this.valueFFcode);
    },

    async addData() {
      const datapost = {
        user_id: this.defaultItem.user_id,
        lahan_no: this.defaultItem.lahan_no,
        farmer_no: this.defaultItem.farmer_no,
        planting_date: this.datepicker1,
        planting_year: this.defaultItem.planting_year,
        lahan_condition: this.defaultItem.lahan_condition,
        gambar1: this.defaultItem.gambar1,
        gambar2: this.defaultItem.gambar2,
        gambar3: this.defaultItem.gambar3,
        list_pohon: this.itemlistpohon,
      };
      console.log(datapost);
      this.dialogDetail = false;
      try {
        const response = await axios.post(
          this.BaseUrlGet + "AddMonitoring",
          datapost,
          {
            headers: {
              Authorization: `Bearer ` + this.authtoken,
            },
          }
        );
        console.log(response.data.data.result);
        if (response.data.data.result == "success") {
          this.loadsave = false;
          this.dialogAddonly = false;
          this.snackbar = true;
          this.colorsnackbar = "green";
          this.textsnackbar = "Sukses menambahkan data";
          this.initialize();
        } else {
          this.dialogAddonly = true;
          this.loadsave = false;
        }
      } catch (error) {
        console.error(error.response);
        if (error.response.status == 401) {
          this.dialogAddonly = true;
          this.loadsave = false;
        }
        this.loadsave = false;
        this.snackbar = true;
        this.colorsnackbar = "red";
        this.textsnackbar = "Gagal menambahkan data, no lahan sudah ada";
      }
    },

    async updateData() {
      const datapost = {
        monitoring_no: this.defaultItem.monitoring_no,
        user_id: this.defaultItem.user_id,
        lahan_no: this.defaultItem.lahan_no,
        farmer_no: this.defaultItem.farmer_no,
        planting_date: this.datepicker1,
        planting_year: this.defaultItem.planting_year,
        lahan_condition: this.defaultItem.lahan_condition,
        gambar1: this.defaultItem.gambar1,
        gambar2: this.defaultItem.gambar2,
        gambar3: this.defaultItem.gambar3,
        list_pohon: this.itemlistpohon,
      };
      console.log(datapost);
      this.dialogDetail = false;
      try {
        const response = await axios.post(
          this.BaseUrlGet + "UpdateMonitoring",
          datapost,
          {
            headers: {
              Authorization: `Bearer ` + this.authtoken,
            },
          }
        );
        console.log(response.data.data.result);
        if (response.data.data.result == "success") {
          this.loadsave = false;
          this.dialog = false;
          this.snackbar = true;
          this.colorsnackbar = "green";
          this.textsnackbar = "Sukses mengubah data";
          this.initialize();
        } else {
          this.dialog = true;
          this.loadsave = false;
        }
      } catch (error) {
        console.error(error.response);
        if (error.response.status == 401) {
          this.dialog = true;
          this.loadsave = false;
        }
        this.loadsave = false;
      }
    },
    async updateDataPohon(datapost) {
      this.dialogDetail = false;
      try {
        const response = await axios.post(
          this.BaseUrlGet + "UpdatePohonMonitoring",
          datapost,
          {
            headers: {
              Authorization: `Bearer ` + this.authtoken,
            },
          }
        );
        console.log(response.data.data.result);
        if (response.data.data.result == "success") {
          this.dialog = false;
          this.snackbar = true;
          this.colorsnackbar = "green";
          this.textsnackbar = "Sukses mengubah data";
          this.dialogDetailPohon = false;
          this.initialize();
        } else {
          this.dialog = true;
        }
      } catch (error) {
        console.error(error.response.data.data);
        if (error.response.status == 401) {
          this.dialog = true;
        } else {
          this.snackbar = true;
          this.colorsnackbar = "red";
          this.textsnackbar = error.response.data.data.result;
        }
      }
    },
    async getPetani() {
      // if (this.User.fc.fc) {
      //   this.fc_no_global = this.User.fc.fc;
      // }
      try {
        const response = await axios.get(
          this.BaseUrlGet +
            "GetFarmerAllAdmin?typegetdata=several&ff=" +
            this.valueFFForm,
          {
            headers: {
              Authorization: `Bearer ` + this.authtoken,
            },
          }
        );
        // console.log(response.data.data.result);
        if (response.data.length != 0) {
          this.itemspetani = response.data.data.result.data;
          // this.dataobject = response.data.data.result;
        } else {
          this.itemspetani = [];
        }
      } catch (error) {
        console.error(error.response);
        if (error.response.status == 401) {
          localStorage.removeItem("token");
          this.$router.push("/");
        }
        this.itemspetani = [];
        this.defaultItem.farmer_no = "";
      }
    },
    async getLahan() {
      // if (this.User.fc.fc) {
      //   this.fc_no_global = this.User.fc.fc;
      // }
      try {
        const response = await axios.get(
          this.BaseUrlGet +
            "GetLahanAll?farmer_no=" +
            this.valuePetaniselected +
            "&user_id=" +
            this.valueFFForm,
          {
            headers: {
              Authorization: `Bearer ` + this.authtoken,
            },
          }
        );
        // console.log(response.data.data.result);
        if (response.data.length != 0) {
          this.itemslahan = response.data.data.result.data;
          // this.dataobject = response.data.data.result;
        } else {
          this.itemslahan = [];
        }
      } catch (error) {
        console.error(error.response);
        if (error.response.status == 401) {
          localStorage.removeItem("token");
          this.$router.push("/");
        }
        this.itemslahan = [];
        this.defaultItem.farmer_no = "";
      }
    },
    async getLahanDetail() {
      // if (this.User.fc.fc) {
      //   this.fc_no_global = this.User.fc.fc;
      // }
      try {
        const response = await axios.get(
          this.BaseUrlGet +
            "GetLahanDetailLahanNo?lahan_no=" +
            this.valueLahanselected,
          {
            headers: {
              Authorization: `Bearer ` + this.authtoken,
            },
          }
        );
        // console.log(response.data.data.result);
        if (response.data.length != 0) {
          this.jarak_lahan = response.data.data.result.jarak_lahan;
          this.akses_jangkauan = response.data.data.result.access_to_lahan;
          //   this.itemslahan = response.data.data.result.data;
          // this.dataobject = response.data.data.result;
        } else {
          this.itemslahan = [];
        }
      } catch (error) {
        console.error(error.response);
        if (error.response.status == 401) {
          localStorage.removeItem("token");
          this.$router.push("/");
        }
        this.itemslahan = [];
        this.defaultItem.farmer_no = "";
      }
    },
    async UploadData(val, type) {
      console.log(this.BaseUrlUpload);
      var dateConvert = Date.now();

      const formData = new FormData();
      formData.append("files", val);
      var namafile = "PH_" + dateConvert;

      // console.log(namafile);
      try {
        const response = await axios.post(
          this.BaseUrlUpload + "?nama=" + namafile,
          formData,
          {
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Content-Type": "application/json",
            },
          }
        );
        console.log(response);
        if (response.data.success == true) {
          this.resultUpload = true;
          if (type == "farmer_signature") {
            this.defaultItem.farmer_signature = response.data.TempName;
          }
          if (type == "gambar1") {
            this.defaultItem.gambar1 = response.data.TempName;
          }
          if (type == "gambar2") {
            this.defaultItem.gambar2 = response.data.TempName;
          }
          if (type == "gambar3") {
            this.defaultItem.gambar3 = response.data.TempName;
          }
        } else {
          this.resultUpload = false;
          // this.dialog = false;
        }
      } catch (error) {
        console.error(error.response);
        if (error.response.status == 401) {
          this.resultUpload = false;
          localStorage.removeItem("token");
          this.$router.push("/");
          // this.dialog = false;
        } else {
          this.resultUpload = false;
        }
      }
    },

    changeBarangSelected(val) {
      console.log(val);
      this.tree_code_temp = val.tree_code;
      this.tree_name_temp = val.tree_name;
      this.tree_category_temp = val.tree_category;
      //   this.satuan_temp = val.satuan;
      this.dialogAddProduct = true;
    },
    adddetailpohon() {
      this.dialogPohon = true;
    },
    async addProduct() {
      if (this.jumlah_temp > 0) {
        var newlist = [];
        var list = this.defaultItem.list_detail;
        // this.loadtabledetail = true;

        console.log(list);
        console.log(list.length);

        // for (let n = 0; n < list.length; n++) {
        //   var productold = {
        //     tree_code: "",
        //     tree_name: "",
        //     qty: 0,
        //     id: 0,
        //     status: "",

        //     condition: "",
        //     planting_date: "",
        //   };

        //   productold.tree_code = list[n].tree_code;
        //   productold.tree_name = list[n].tree_name;
        //   productold.status = list[n].status;
        //   productold.condition = list[n].condition;
        //   productold.planting_date = list[n].planting_date;
        //   productold.qty = list[n].qty;

        //   newlist.push(productold);
        // }

        var productset = {
          tree_code: "",
          tree_name: "",
          qty: 0,
          id: 0,
          //   ph_form_no: "",
          status: "",
          condition: "",
          planting_date: "",
        };

        productset.id = this.max_value_pohon_temp + 1;
        productset.tree_code = this.trees_add_temp.tree_code;
        productset.tree_name = this.trees_add_temp.tree_name;
        productset.status = this.status_temp;
        productset.condition = this.condition_temp;
        productset.planting_date = this.datepicker2;
        // productset.tree_category = this.tree_category_temp;
        productset.qty = Number(this.jumlah_temp);

        newlist.push(productset);

        this.snackbar = true;
        this.colorsnackbar = "green";
        this.textsnackbar = "Product Berhasil ditambahkan..!!!";

        this.dialogAddProduct = false;
        this.loadtabledetail = false;

        this.defaultItem.list_detail = [];

        this.max_value_pohon_temp = productset.id;
      } else {
        this.snackbar = true;
        this.colorsnackbar = "red";
        this.textsnackbar = "Jumlah Buku Tidak boleh 0..!!!";
      }
    },

    async deletelistitemproduct(item) {
      console.log(item);
      //   var newlist = [];
      //   this.loadtabledetail = true;

      //   var list = this.defaultItem.list_detail;
      //   this.defaultItem.list_detail = [];
      //   console.log(list);
      //   var result = false;
      //   for (let n = 0; n < list.length; n++) {
      //     if (list[n].tree_code == item.tree_code) {
      //       result = true;
      //       console.log(result);
      //       // break;
      //     } else {
      //       var productold = {
      //         tree_code: "",
      //         tree_name: "",
      //         amount: 0,
      //         id: 0,
      //         ph_form_no: "",
      //         tree_category: "",
      //       };

      //       productold.tree_code = list[n].tree_code;
      //       productold.tree_name = list[n].tree_name;
      //       productold.tree_category = list[n].tree_category;
      //       productold.amount = list[n].amount;

      //       newlist.push(productold);
      //     }
      //   }
      //   this.defaultItem.list_detail = [];

      //   this.snackbar = true;
      //   this.colorsnackbar = "green";
      //   this.textsnackbar = "Product Berhasil dihapus..!!!";

      //   this.defaultItem.list_detail = newlist;

      //   this.loadtabledetail = false;
    },

    canceladdproduk() {
      this.dialogAddProduct = false;
    },

    selectedMU(a) {
      console.log(a);
      this.valueMU = a;
      if (a != null) {
        this.getTA("table");
        this.valueTA = "";
        this.selectTA = "";
        this.selectVillage = "";
        this.valueVillage = "";
      } else {
        this.valueMU = "";
        this.valueTA = "";
        this.itemsTA = [];
        this.valueVillage = "";
        this.itemsVillage = [];
      }
      // this.initialize();
    },
    selectedTA(a) {
      console.log(a);
      this.valueTA = a;
      if (a != null) {
        this.getVillage("table");
        this.valueVillage = "";
        this.selectVillage = "";
      } else {
        this.valueTA = "";
        this.valueVillage = "";
        this.itemsVillage = [];
      }
      // this.initialize();
    },
    selectedVillage(a) {
      console.log(a);
      this.valueVillage = a;
      if (a == null) {
        this.valueVillage = "";
      }
      // this.initialize();
    },
    selectedUM(a) {
      console.log(a);
      this.valueUM = a;
      if (a != null) {
        this.getEmpFCbyManager(a);
        this.GetFFbyUMandFC("UM", a);
        this.valueFC = "";
        this.selectFC = "";
        this.typegetdata = "several";
      } else {
        this.valueUM = "";
        this.valueFC = "";
        this.itemsfc = [];
        this.typegetdata = this.User.ff.value_data;
      }
      // this.initialize();
    },
    selectedFC(a) {
      console.log(a);
      this.valueFC = a;
      this.GetFFbyUMandFC("FC", a);
      this.typegetdata = "several";
      if (a == null) {
        this.valueFC = "";
        this.selectFC = "";
        this.typegetdata = this.User.ff.value_data;
      }
    },
    showDetail(item) {
      this.type = "Detail";
      this.dialogDetail = true;
      this.getDetail(item);
    },

    selectedMUForm(a) {
      console.log(a);
      this.valueMUForm = a;
      if (a != null) {
        this.getTA("form");
        this.getFarmerGroup();
        this.valueTAForm = "";
        this.selectTAForm = "";
        this.selectVillageForm = "";
        this.valueVillageForm = "";
      } else {
        this.valueMUForm = "";
        this.valueTAForm = "";
        this.itemsTAForm = [];
        this.valueVillageForm = "";
        this.itemsVillageForm = [];
        this.defaultItem.mu_no = a;
      }
    },
    selectedTAForm(a) {
      console.log(a);
      this.valueTAForm = a;
      if (a != null) {
        this.getVillage("form");
        this.valueVillageForm = "";
        this.selectVillageForm = "";
        this.defaultItem.village = "";
      } else {
        this.valueTAForm = "";
        this.valueVillageForm = "";
        this.itemsVillageForm = [];
        this.defaultItem.village = "";
        this.defaultItem.kode_ta = a;
      }
    },
    selectedVillageForm(a) {
      console.log(a);
      this.valueVillageForm = a;
      this.defaultItem.village = a;
      if (a == null) {
        this.valueVillageForm = "";
        this.defaultItem.village = "";
      }
    },
    selectPetani(a) {
      console.log(a);
      // this.valueMUForm = a;
      if (a != null) {
        this.valueFFForm = a;
        this.getPetani();
      } else {
        this.defaultItem.ff_no = "";
        this.defaultItem.kode = "";
        this.itemspetani = [];
      }
    },
    selectLahan(a) {
      console.log(a);
      // this.valueMUForm = a;
      if (a != null) {
        this.valuePetaniselected = a;
        this.getLahan();
      } else {
        // this.defaultItem.ff_no = "";
        // this.defaultItem.kode = "";
        this.itemslahan = [];
      }
    },
    selectedLahanNo(a) {
      console.log(a);
      // this.valueMUForm = a;
      if (a != null) {
        this.valueLahanselected = a;
        this.getLahanDetail();
      } else {
        // this.defaultItem.ff_no = "";
        // this.defaultItem.kode = "";
        // this.itemslahan = [];
      }
    },

    async showFilterArea() {
      // console.log(localStorage.getItem("token"));
      this.dialogFilterArea = true;
    },
    async showFilterEmployee() {
      this.dialogFilterEmp = true;
    },
    resetFilter() {
      if (this.dialogFilterArea == true) {
        this.valueUM = "";
        this.valueFC = "";
        this.selectUM = "";
        this.selectFC = "";
      } else if (this.dialogFilterEmp == true) {
        this.valueMU = "";
        this.valueFC = "";
        this.valueVillage = "";
        this.selectMU = "";
        this.selectTA = "";
        this.selectVillage = "";
      }
      this.valueFFcode = this.User.ff.ff;
      this.typegetdata = this.User.ff.value_data;
    },
    async searchbyarea() {
      await this.resetFilter();
      await this.initialize();
      this.dialogFilterArea = false;
    },
    async searchbyemp() {
      await this.resetFilter();
      await this.initialize();
      this.dialogFilterEmp = false;
    },

    resetvalue() {
      this.defaultItem.id = "";
      this.defaultItem.monitoring_no = "";
      this.defaultItem.lahan_no = "";
      this.defaultItem.farmer_no = "";
      this.defaultItem.planting_year = "";
      this.defaultItem.user_id = "";
      this.defaultItem.list_detail = [];
      this.itemlistpohon = [];

      this.e1 = 1;

      this.gambarinput1 = "";
      this.gambarinput2 = "";
      this.gambarinput3 = "";
      this.defaultItem.farmer_signature = "/images/noimage.png";
      this.defaultItem.gambar1 = "/images/noimage.png";
      this.defaultItem.gambar2 = "/images/noimage.png";
      this.defaultItem.gambar3 = "/images/noimage.png";
      this.defaultItem.gambarshow1 = "/images/noimage.png";
      this.defaultItem.gambarshow2 = "/images/noimage.png";
      this.defaultItem.gambarshow3 = "/images/noimage.png";

      this.load = false;
    },
    async showAddModal() {
      this.$store.state.loadingOverlayText = 'Get lahan umum datas...'
      this.$store.state.loadingOverlay = true

      // reset data
      this.dialogFormLahanUmum.inputs.mou_no.model = null
      this.dialogFormLahanUmum.inputs.adjustment.items = []
      this.dialogFormLahanUmum.inputs.land_condition = ''
      this.dialogFormLahanUmum.inputs.qty_std = 0
      this.dialogFormLahanUmum.inputs.planting_date.model = moment().format('Y-MM-DD')
      this.dialogFormLahanUmum.inputs.photo1.model = null
      this.dialogFormLahanUmum.inputs.photo1.preview = null
      this.dialogFormLahanUmum.inputs.photo2.model = null
      this.dialogFormLahanUmum.inputs.photo2.preview = null
      this.dialogFormLahanUmum.inputs.photo3.model = null
      this.dialogFormLahanUmum.inputs.photo3.preview = null

      await this.getLahanUmumDataOptions()
      
      this.$store.state.loadingOverlay = false
      this.$store.state.loadingOverlayText = null

      this.dialogFormLahanUmum.model = true
    },
    async showEditModal(item) {
      console.log("test");
      this.type = "Edit";
      this.resetvalue();
      //   console.log(this.itemTemp);
      this.dialogAddonly = true;
      this.dialogShowEdit = false;
      await this.getDetail(item);
      //   await this.getPetani();
      //   console.log(item.farmer_no);
      //   console.log(item);
      this.formTitle = "Edit data";
      //   this.defaultItem.farmer_no = this.itemTemp.farmer_no;
    },
    async showEditJumlahPohonModal() {
      // console.log(item.kode);
      this.type = "Edit";
      await this.getDetail(this.itemTemp);

      this.DetailTreesLahanTemp = this.defaultItem.planting_details;
      // await this.getTA("form");
      // await this.getVillage("form");
      // this.getPetani();
      console.log(this.DetailTreesLahanTemp.length);
      if (this.DetailTreesLahanTemp.length == 0) {
        this.snackbar = true;
        this.colorsnackbar = "red";
        this.textsnackbar =
          "Tidak Bisa Edit, Jumlah Pohon Kosong. Harus di isi lewat aplikasi android";
      } else {
        this.dialogShowEdit = false;
        this.dialogDetailPohon = true;
      }
    },
    async showEditDetailModal(item) {
      this.type = "Edit";
      this.itemTemp = item;
      // await this.getDetail(item);
      console.log(this.itemTemp);
      this.dialogShowEdit = true;
    },
    showPrintModal(item) {
      if (item.is_validate == 1) {
        this.type = "Detail";
        // this.dialogDetail = true;
        //   this.getDetail(item);
        this.ph_form_no_temp = item.ph_form_no;

        this.dialogCetakPilihan = true;
      } else {
        this.snackbar = true;
        this.colorsnackbar = "red";
        this.textsnackbar = "Tidak Bisa Cetak. Status Belum Verifikasi";
      }
      //   var str = this.BaseUrlGet;
      //   window.open(
      //     str.substring(0, str.length - 4) +
      //       "CetakLabelLubangTanam?ph_form_no=" +
      //       item.ph_form_no
      //   );
    },
    showPrintLabel() {
      this.type = "Detail";
      // this.dialogDetail = true;
      //   this.getDetail(item);

      this.dialogCetakPilihan = false;
      var str = this.BaseUrlGet;
      window.open(
        str.substring(0, str.length - 4) +
          "CetakLabelLubangTanamTemp?ph_form_no=" +
          this.ph_form_no_temp
      );
    },
    showPrintTandaTerima() {
      this.dialogCetakPilihan = false;
      var str = this.BaseUrlGet;
      window.open(
        str.substring(0, str.length - 4) +
          "CetakBuktiPenyerahanTemp?ph_form_no=" +
          this.ph_form_no_temp
      );
    },

    saveEditPohon() {
      const d = new Date();
      var year = d.getFullYear();
      var month = d.getMonth();
      var date = d.getDate();

      var datenow = year + "-" + month + "-" + date;

      const datapost = {
        form_no: this.defaultItem.form_no,
        list_pohon: this.DetailTreesLahanTemp,
        detail_year: datenow,
      };

      console.log(datapost);
      this.updateDataPohon(datapost);
    },
    saveEditPohonTemp() {
      Object.assign(
        this.DetailTreesLahanTemp[this.editedIndexPohon],
        this.editedItemPohon
      );

      console.log(this.DetailTreesLahanTemp);

      this.dialogDetailPohonEdit = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.editedItemPohon);
        this.editedIndex = -1;
      });
    },
    editDetailPohon(item) {
      console.log(item);
      this.editedItemPohon.amount = item.amount;
      this.idPohonTemp = item.id;
      this.editedIndexPohon = this.DetailTreesLahanTemp.indexOf(item);
      this.editedItemPohon = Object.assign({}, item);
      this.dialogDetailPohonEdit = true;
    },
    deleteDetailPohon(item) {
      console.log(item);
      this.editedIndexPohon = this.DetailTreesLahanTemp.indexOf(item);
      this.editedItemPohon = Object.assign({}, item);

      this.DetailTreesLahanTemp.splice(this.editedIndexPohon, 1);

      console.log(this.DetailTreesLahanTemp);

      // this.dialogDetailPohonEdit = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.editedItemPohon);
        this.editedIndex = -1;
      });
    },

    showUnverifModal(item) {
      this.defaultItem.monitoring_no = item.monitoring_no;
      this.defaultItem.is_validate = item.is_validate;
      this.dialogUnverif = true;
    },

    async updateSeedlingAdjustment() {
      await this.dialogFormLahanUmum.inputs.adjustment.items.forEach(val => {
        val.lost = parseInt(val.total_tree_received) - ( parseInt(val.total_tree_planted_life) + parseInt(val.total_tree_planted_dead) + parseInt(val.total_tree_unplanted_life) + parseInt(val.total_tree_unplanted_dead) )
        if (val.lost < 0 || val.lost > val.total_tree_received) {
          alert('Invalid input!')
          val.lost = val.total_tree_received
          val.total_tree_planted_life = 0
          val.total_tree_planted_dead = 0
          val.total_tree_unplanted_life = 0
          val.total_tree_unplanted_dead = 0
        }
      })
    },
    
    dateFormat(date, format) {
      return moment(date).format(format)
    },
    async unverifItemConfirm() {
      // this.dialogDetail = false;
      try {
        this.dialogUnverif = false
        this.$store.state.loadingOverlayText = 'Unverifying data...'
        this.$store.state.loadingOverlay = true
        const datapost = {
          monitoring_no: this.defaultItem.monitoring_no,
          is_validate: parseInt(this.defaultItem.is_validate) - 1
        }
        await axios.post(this.BaseUrlGet + "UnverificationMonitoring", datapost, this.$store.state.apiConfig);
        this.textsnackbar = "Data unverified!"
        this.colorsnackbar = 'green'
        await this.initialize();
      } catch (error) {
        console.error(error.response);
        this.textsnackbar = "Data failed to unverif!"
        this.colorsnackbar = 'red'
        if (error.response.status == 401) {
          this.alerttoken = true;
          this.dialogUnverif = false;
          localStorage.removeItem("token");
          this.$router.push("/");
        }
      } finally {
        this.timeoutsnackbar = 5000
        this.snackbar = true
        this.$store.state.loadingOverlayText = null
        this.$store.state.loadingOverlay = false
      }
    },
    close() {
      this.dialog = false;
      this.dialogAddProduct = false;
      this.dialogdownload = false;
      this.dialogAddonly = false;
    },

    closePohonTambah() {
      this.dialogPohon = false;
    },
    closeDelete() {
      this.dialogUnverif = false;
    },
    closeDetailEditPohon() {
      this.dialogDetailPohonEdit = false;
    },
    closeDetailDeletePohon() {
      this.dialogDetailPohonEdit = false;
    },
    closeDetailPohon() {
      this.dialogDetailPohon = false;
    },

    verifSubmit() {
      this.dialogVerification = true;
    },
    VerificationItemConfirm() {
      this.verif();
    },
    async VerificationUMItemConfirm() {
      try {
        this.dialogVerificationUM = false
        this.dialogDetail = false
        this.$store.state.loadingOverlayText = 'Verifying monitoring by UM...'
        this.$store.state.loadingOverlay = true

        const data = this.defaultItem
        let listTrees = []
        // ungrouping per condition
        await data.list_detail.forEach((tree) => {
          if (tree.seedling.ditanam.hidup > 0) {
            let pushData = {
              tree_code: tree.tree_code,
              qty: tree.seedling.ditanam.hidup,
              status: 'sudah_ditanam',
              condition: 'hidup',
              planting_date: data.planting_date,
            }
            listTrees.push(pushData)
          }
          if (tree.seedling.ditanam.mati > 0) {
            let pushData = {
              tree_code: tree.tree_code,
              qty: tree.seedling.ditanam.mati,
              status: 'sudah_ditanam',
              condition: 'mati',
              planting_date: data.planting_date,
            }
            listTrees.push(pushData)
          }
          if (tree.seedling.blm_ditanam.hidup > 0) {
            let pushData = {
              tree_code: tree.tree_code,
              qty: tree.seedling.blm_ditanam.hidup,
              status: 'belum_ditanam',
              condition: 'hidup',
              planting_date: data.planting_date,
            }
            listTrees.push(pushData)
          }
          if (tree.seedling.blm_ditanam.mati > 0) {
            let pushData = {
              tree_code: tree.tree_code,
              qty: tree.seedling.blm_ditanam.mati,
              status: 'belum_ditanam',
              condition: 'mati',
              planting_date: data.planting_date,
            }
            listTrees.push(pushData)
          }
          if (tree.seedling.hilang > 0) {
            let pushData = {
              tree_code: tree.tree_code,
              qty: tree.seedling.hilang,
              status: 'hilang',
              condition: 'hilang',
              planting_date: data.planting_date,
            }
            listTrees.push(pushData)
          }
        })
        
        const url = `${this.BaseUrlGet}MonitoringVerificationUM`
        const postData = {
          monitoring_no: data.monitoring_no,
          list_trees: listTrees,
          validate_by: this.User.email
        }
        const response = await axios.post(url, postData, {
          headers: {
            Authorization: `Bearer ${this.authtoken}`
          }
        })
        if (response) {
          this.textsnackbar = "Verified!"
          this.timeoutsnackbar = 5000
          this.colorsnackbar = 'green'
          await this.initialize()
        }
      } catch (error) {
        this.textsnackbar = error.message
        this.timeoutsnackbar = 5000
        this.colorsnackbar = 'red'
        console.log(error)
      } finally {
        this.snackbar = true
        this.$store.state.loadingOverlay = false
        this.$store.state.loadingOverlayText = null
      }
    },
    closeVerification() {
      this.dialogVerification = false;
    },

    async SaveAdd() {
      this.loadsave = true;
      if (this.defaultItem.fileUploadReady_gambar1 == true) {
        await this.UploadData(this.defaultItem.fileUpload1, "gambar1");
      }
      if (this.defaultItem.fileUploadReady_gambar2 == true) {
        await this.UploadData(this.defaultItem.fileUpload2, "gambar1");
      }
      if (this.defaultItem.fileUploadReady_gambar3 == true) {
        await this.UploadData(this.defaultItem.fileUpload3, "gambar3");
      }

      const datapost = {
        user_id: this.defaultItem.user_id,
        lahan_no: this.defaultItem.lahan_no,
        farmer_no: this.defaultItem.farmer_no,
        planting_date: this.datepicker1,
        planting_year: this.defaultItem.planting_year,
        lahan_condition: this.defaultItem.lahan_condition,
        gambar1: this.defaultItem.gambar1,
        gambar2: this.defaultItem.gambar2,
        gambar3: this.defaultItem.gambar3,
        list_pohon: this.defaultItem.list_detail,
      };

      console.log(datapost);

      //   if (this.defaultItem.id) {
      //     this.updateData();
      //   } else {
      //     this.addData();
      //   }
    },
    async save() {
      this.loadsave = true;
      // this.$refs.form.validate();

      if (
        this.defaultItem.user_id != "" &&
        this.defaultItem.lahan_no != "" &&
        this.defaultItem.farmer_no != "" &&
        this.defaultItem.planting_year != "" &&
        this.defaultItem.lahan_condition != ""
      ) {
        this.loadsave = true;
        if (this.defaultItem.fileUploadReady_gambar1 == true) {
          await this.UploadData(this.defaultItem.fileUpload1, "gambar1");
        }
        if (this.defaultItem.fileUploadReady_gambar2 == true) {
          await this.UploadData(this.defaultItem.fileUpload2, "gambar1");
        }
        if (this.defaultItem.fileUploadReady_gambar3 == true) {
          await this.UploadData(this.defaultItem.fileUpload3, "gambar3");
        }

        if (this.defaultItem.id) {
          this.updateData();
        } else {
          this.addData();
        }
      } else {
        this.snackbar = true;
        this.colorsnackbar = "red";
        this.textsnackbar =
          "Gagal Simpan, Kolom required tidak boleh ada yang kosong";
      }

      // this.close();
    },

    capitalize(word) {
      return word[0].toUpperCase() + word.substring(1).toLowerCase();
    },
    genderindo(val) {
      if (val == "male") {
        return "Laki-Laki";
      } else {
        return "Perempuan";
      }
    },
    convertToRupiah(angka) {
      var rupiah = "";
      var angkarev = angka.toString().split("").reverse().join("");
      for (var i = 0; i < angkarev.length; i++)
        if (i % 3 == 0) rupiah += angkarev.substr(i, 3) + ".";
      rupiah = rupiah
        .split("", rupiah.length - 1)
        .reverse()
        .join("");
      return "Rp. " + (rupiah.length < 1 ? "0" : rupiah) + ",-";
    },
    waitingapprovefunct(valapprove) {
      if (valapprove == 0) {
        return true;
      } else {
        return false;
      }
    },

    pilihgambar1(event) {
      console.log(event);
      if (event != null) {
        this.defaultItem.gambarshow1 = URL.createObjectURL(event);
        console.log(this.defaultItem.gambarshow1);
        this.defaultItem.fileUpload1 = event;
        this.defaultItem.fileUploadReady_gambar1 = true;
        // this.filephotoarray.push("lahan1");
      } else {
        this.defaultItem.gambarshow1 = "/images/noimage.png";
        this.defaultItem.fileUploadReady_gambar1 = false;
        // this.defaultItem.photo1 = "";
        // const index = this.filephotoarray.indexOf("lahan1");
        // if (index > -1) {
        //   this.filephotoarray.splice(index, 1);
        // }
      }
    },
    pilihgambar2(event) {
      console.log(event);
      if (event != null) {
        this.defaultItem.gambarshow2 = URL.createObjectURL(event);
        console.log(this.defaultItem.gambarshow2);
        this.defaultItem.fileUpload2 = event;
        this.defaultItem.fileUploadReady_gambar2 = true;
        // this.filephotoarray.push("lahan1");
      } else {
        this.defaultItem.gambarshow2 = "/images/noimage.png";
        this.defaultItem.fileUploadReady_gambar2 = false;
        // this.defaultItem.photo1 = "";
        // const index = this.filephotoarray.indexOf("lahan1");
        // if (index > -1) {
        //   this.filephotoarray.splice(index, 1);
        // }
      }
    },
    pilihgambar3(event) {
      console.log(event);
      if (event != null) {
        this.defaultItem.gambarshow3 = URL.createObjectURL(event);
        console.log(this.defaultItem.gambarshow3);
        this.defaultItem.fileUpload3 = event;
        this.defaultItem.fileUploadReady_gambar3 = true;
        // this.filephotoarray.push("lahan1");
      } else {
        this.defaultItem.gambarshow3 = "/images/noimage.png";
        this.defaultItem.fileUploadReady_gambar3 = false;
        // this.defaultItem.photo1 = "";
        // const index = this.filephotoarray.indexOf("lahan1");
        // if (index > -1) {
        //   this.filephotoarray.splice(index, 1);
        // }
      }
    },

    gettanggal(val) {
      var bulanIndo = [
        "",
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "Mei",
        "Juni",
        "Juli",
        "Agust",
        "Sept",
        "Okt",
        "Nov",
        "Des",
      ];

      var date = val.split(" ")[0];

      var tanggal = date.split("-")[2];
      var bulan = date.split("-")[1];
      var tahun = date.split("-")[0];

      return tanggal + " " + bulanIndo[Math.abs(bulan)] + " " + tahun;
    },

    downloadSuperAdmin() {
      this.dialogdownload = true;
      this.downloadvalueff = false;
      this.downloadvaluetime = false;
      this.downloadvaluepetani = false;
      this.loaddownload = false;
      // console.log(this.valueMUExcel);
      // console.log(this.valueTAExcel);
      // console.log(this.valueVillageExcel);
      // console.log(this.typegetdataExcel);
      // console.log(this.valueFFcodeExcel);
    },
    pilihtipedownload(val) {
      console.log(val);
      if (val == "output_data") {
        this.downloadvalueff = false;
        this.downloadvaluetime = false;
        this.downloadvaluepetani = false;
      } else if (val == "loading_plan") {
        this.loaddownload = true;
        this.getFF();
        console.log(this.itemsff);
        this.downloadvalueff = true;
        this.downloadvaluetime = false;
        this.downloadvaluepetani = false;
      } else if (val == "packing_plan") {
        this.loaddownload = true;
        this.getDistribusiTimeDownload();
        this.downloadvalueff = false;
        this.downloadvaluetime = true;
        this.downloadvaluepetani = false;
      } else if (val == "shipping_plan") {
        this.loaddownload = true;
        this.getDistribusiTimeDownload();
        this.downloadvalueff = false;
        this.downloadvaluetime = true;
        this.downloadvaluepetani = false;
      } else if (val == "farmer_receipt") {
        this.loaddownload = true;
        this.getPetaniDownload();
        this.downloadvalueff = false;
        this.downloadvaluetime = false;
        this.downloadvaluepetani = true;
      } else {
        this.snackbar = true;
        this.colorsnackbar = "red";
        this.textsnackbar = "Gagal tipe tidak tersedia";
        this.downloadvalueff = false;
        this.downloadvaluetime = false;
        this.downloadvaluepetani = false;
      }
    },
    verifytipedownload() {
      console.log(this.selectFFdownload.ff_no);
      console.log(this.selectpetanidownload.kodePetani);
      console.log(this.selectdistribusitimedownload);
      if (this.valuedownloadselected == "output_data") {
        this.downloadall();
      } else if (this.valuedownloadselected == "loading_plan") {
        if (this.selectFFdownload.ff_no) {
          this.downloadloadingplan(this.selectFFdownload.ff_no);
        } else {
          this.snackbar = true;
          this.colorsnackbar = "red";
          this.textsnackbar = "Gagal, pilih ff terlebih dahulu";
        }
      } else if (this.valuedownloadselected == "packing_plan") {
        if (this.selectdistribusitimedownload) {
          this.downloadpackingplan(this.selectdistribusitimedownload);
        } else {
          this.snackbar = true;
          this.colorsnackbar = "red";
          this.textsnackbar = "Gagal, pilih waktu distribusi terlebih dahulu";
        }
      } else if (this.valuedownloadselected == "shipping_plan") {
        // this.downloadshippingplan();
        if (this.selectdistribusitimedownload) {
          this.downloadshippingplan(this.selectdistribusitimedownload);
        } else {
          this.snackbar = true;
          this.colorsnackbar = "red";
          this.textsnackbar = "Gagal, pilih waktu distribusi terlebih dahulu";
        }
      } else if (this.valuedownloadselected == "farmer_receipt") {
        // this.downloadfarmerreceipt();
        if (this.selectpetanidownload.kodePetani) {
          this.downloadfarmerreceipt(this.selectpetanidownload.kodePetani);
        } else {
          this.snackbar = true;
          this.colorsnackbar = "red";
          this.textsnackbar = "Gagal, pilih petani terlebih dahulu";
        }
      } else {
        this.snackbar = true;
        this.colorsnackbar = "red";
        this.textsnackbar = "Gagal tipe tidak tersedia";
      }
    },

    downloadall() {
      var str = this.BaseUrlGet;
      window.open(
        str.substring(0, str.length - 4) +
          "CetakExcelPlantingHoleAll?mu=" +
          this.valueMUExcel +
          "&ta=" +
          this.valueTAExcel +
          "&village=" +
          this.valueVillageExcel +
          "&typegetdata=" +
          this.typegetdataExcel +
          "&ff=" +
          this.valueFFcodeExcel +
          "&max_kayu=" +
          this.max_kayu +
          "&max_mpts=" +
          this.max_mpts +
          "&max_crops=" +
          this.max_crops
      );

      this.valueMUExcel = "";
      this.valueTAExcel = "";
      this.valueVillageExcel = "";
      this.typegetdataExcel = "";
      this.valueFFcodeExcel = "";
    },
    downloadpackingplan(val) {
      var str = this.BaseUrlGet;
      window.open(
        str.substring(0, str.length - 4) +
          "CetakExcelPackingPlan?date=" +
          val +
          "&max_kayu=" +
          this.max_kayu +
          "&max_mpts=" +
          this.max_mpts +
          "&max_crops=" +
          this.max_crops
      );
    },
    downloadshippingplan(val) {
      var str = this.BaseUrlGet;
      window.open(
        str.substring(0, str.length - 4) +
          "CetakExcelShippingPlan?date=" +
          val +
          "&max_kayu=" +
          this.max_kayu +
          "&max_mpts=" +
          this.max_mpts +
          "&max_crops=" +
          this.max_crops
      );
    },
    downloadloadingplan(val) {
      var str = this.BaseUrlGet;
      window.open(
        str.substring(0, str.length - 4) +
          "CetakExcelLoadingPlan?typegetdatadownload=ff&ff=" +
          val +
          "&max_kayu=" +
          this.max_kayu +
          "&max_mpts=" +
          this.max_mpts +
          "&max_crops=" +
          this.max_crops
      );
    },
    downloadfarmerreceipt(val) {
      var str = this.BaseUrlGet;
      window.open(
        str.substring(0, str.length - 4) +
          "CetakExcelLoadingPlan?typegetdatadownload=farmer&farmer_no=" +
          val +
          "&max_kayu=" +
          this.max_kayu +
          "&max_mpts=" +
          this.max_mpts +
          "&max_crops=" +
          this.max_crops
      );
    },

    deleteItemPohon(item) {
      this.editedIndexPohon = this.itemlistpohon.indexOf(item);
      this.editedItemPohon = Object.assign({}, item);
      console.log(item);
      this.dialogDeletePohon = true;
    },
    deleteItemConfirmPohon() {
      this.itemlistpohon.splice(this.editedIndexPohon, 1);
      this.closeDeletePohon();
    },
    closePohon() {
      this.dialogPohon = false;
      this.$nextTick(() => {
        this.editedItemPohon = Object.assign({}, this.defaultItemPohon);
        this.editedIndexPohon = -1;
      });
    },
    closeDeletePohon() {
      this.dialogDeletePohon = false;
      this.$nextTick(() => {
        this.editedItemPohon = Object.assign({}, this.defaultItemPohon);
        this.editedIndexPohon = -1;
      });
    },
    savePohon() {
      if (this.editedIndexPohon > -1) {
        Object.assign(
          this.itemlistpohon[this.editedIndexPohon],
          this.editedItemPohon
        );
      } else {
        this.editedItemPohon.planting_date = this.datepicker4;
        this.editedItemPohon.tree_code = this.tree_temp.tree_code;
        this.editedItemPohon.tree_name = this.tree_temp.tree_name;
        // console.log(this.editedItemPohon);
        this.itemlistpohon.push(this.editedItemPohon);
        //   console.log(this.datepicker4);
      }
      this.closePohon();
    },
    showLightbox(imgs, index) {
        if (imgs) this.$store.state.lightbox.imgs = imgs
        
        if (index) this.$store.state.lightbox.index = index
        else this.$store.state.lightbox.index = 0

        this.$store.state.lightbox.show = true
    },
    async setGroupingDetailSeedling(datas) {
      console.log(datas)
      let grouping = []
      await datas.forEach(data => {
        let pushData = {
          tree_code: data.tree_code,
          tree_category: data.tree_category == 'Pohon_Kayu' ? "KAYU" : (data.tree_category == 'Pohon_Buah' ? "MPTS" : "CROPS"),
          tree_name: data.tree_name,
          seedling: {
            ditanam: {
              hidup: 0,
              mati: 0
            },
            blm_ditanam: {
              hidup: 0,
              mati: 0
            },
            hilang: 0
          }
        }
        const checkExistsID = grouping.findIndex(grp => grp.tree_code == data.tree_code)
        if (checkExistsID > -1) {
          if (data.status == 'sudah_ditanam' && data.condition == 'hidup') {
            grouping[checkExistsID].seedling.ditanam.hidup += parseInt(data.amount)
          } else if (data.status == 'sudah_ditanam' && data.condition == 'mati') {
            grouping[checkExistsID].seedling.ditanam.mati += parseInt(data.amount)
          } else if (data.status == 'belum_ditanam' && data.condition == 'hidup') {
            grouping[checkExistsID].seedling.blm_ditanam.hidup += parseInt(data.amount)
          } else if (data.status == 'belum_ditanam' && data.condition == 'mati') {
            grouping[checkExistsID].seedling.blm_ditanam.mati += parseInt(data.amount)
          } else if (data.status == 'hilang' && data.condition == 'hilang') {
            grouping[checkExistsID].seedling.hilang += parseInt(data.amount)
          } 
        } else {
          if (data.status == 'sudah_ditanam' && data.condition == 'hidup') {
            pushData.seedling.ditanam.hidup += parseInt(data.amount)
          } else if (data.status == 'sudah_ditanam' && data.condition == 'mati') {
            pushData.seedling.ditanam.mati += parseInt(data.amount)
          } else if (data.status == 'belum_ditanam' && data.condition == 'hidup') {
            pushData.seedling.blm_ditanam.hidup += parseInt(data.amount)
          } else if (data.status == 'belum_ditanam' && data.condition == 'mati') {
            pushData.seedling.blm_ditanam.mati += parseInt(data.amount)
          } else if (data.status == 'hilang' && data.condition == 'hilang') {
            pushData.seedling.hilang += parseInt(data.amount)
          } 
          grouping.push(pushData)
        }
      })
      console.log(grouping)
      return grouping
    },
    numberFormat(num) {
        return new Intl.NumberFormat('id-ID').format(num)
    },
    photo1FileChanged (event) {
        if (event) {
            let fileSize = event.size / 1000000
            console.log(fileSize)
            if (fileSize < 6) {
                this.dialogFormLahanUmum.inputs.photo1.model = event
                this.dialogFormLahanUmum.inputs.photo1.preview = URL.createObjectURL(event)
            } else {
                alert(`Please change your photo file, it's too big. Max 6mb.`)
            }
        } else {
            this.dialogFormLahanUmum.inputs.photo1.model = null
            this.dialogFormLahanUmum.inputs.photo1.preview = ""
        }
    },
    photo2FileChanged (event) {
        if (event) {
            let fileSize = event.size / 1000000
            console.log(fileSize)
            if (fileSize < 6) {
                this.dialogFormLahanUmum.inputs.photo2.model = event
                this.dialogFormLahanUmum.inputs.photo2.preview = URL.createObjectURL(event)
            } else {
                alert(`Please change your photo file, it's too big. Max 6mb.`)
            }
        } else {
            this.dialogFormLahanUmum.inputs.photo2.model = null
            this.dialogFormLahanUmum.inputs.photo2.preview = ""
        }
    },
    photo3FileChanged (event) {
        if (event) {
            let fileSize = event.size / 1000000
            console.log(fileSize)
            if (fileSize < 6) {
                this.dialogFormLahanUmum.inputs.photo3.model = event
                this.dialogFormLahanUmum.inputs.photo3.preview = URL.createObjectURL(event)
            } else {
                alert(`Please change your photo file, it's too big. Max 6mb.`)
            }
        } else {
            this.dialogFormLahanUmum.inputs.photo3.model = null
            this.dialogFormLahanUmum.inputs.photo3.preview = ""
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
    async uploadPhotos(type, file) {
        this.$store.state.loadingOverlayText = `Saving photo "${type}"...`
        const url = `${this.BaseUrl}general-lands/upload.php`
        const newName = `${this.dialogFormLahanUmum.inputs.mou_no.model.replace(/\s/g, '').replaceAll('/', '_')}_${type}`
        const data = this.generateFormData({
            dir: 'first-monitorings',
            nama: newName,
            image: file
        })
        let responseName = null
        await axios.post(url,data).then(res => {
            responseName = res.data.data.new_name
        }).catch(err => {
            console.error(err)
        })
        return 'general-lands/'+responseName
    }
  },
};
</script>
