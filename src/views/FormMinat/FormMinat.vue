<template>
  <div>
    <v-breadcrumbs
      :dark="$store.state.theme == 'dark'"
      data-aos="fade-right"
      class="breadcrumbsmain"
      :items="itemsbr"
      divider=">"
      large
    ></v-breadcrumbs>

    <v-data-table
      data-aos="fade-up"
      data-aos-delay="200"
      :headers="headers"
      :items="dataobject"
      :search="search"
      :loading="loadtable"
      loading-text="Loading... Please wait"
      class="rounded elevation-6 mx-3 pa-1"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-btn
            v-if="roleuser == 19"
            dark
            class="mb-2"
            @click="showAddModal()"
            color="green"
          >
            <v-icon small>mdi-plus</v-icon> Add Item
          </v-btn>
          <v-btn
            v-if="roleuser == 19"
            dark
            class="mb-2 d-none d-md-block ml-1"
            @click="showAddListModal()"
            color="green"
          >
            <v-icon small>mdi-plus</v-icon> Add List Item
          </v-btn>

          <!-- Modal Add List -->
          <v-dialog v-model="dialogAdd" max-width="1100px">
            <v-card>
              <v-card-title class="mb-1 headermodalstyle">
                <span class="headline">Add List Item</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row class="my-1">
                    <v-row>
                      <v-col cols="12" sm="3" md="3" class="pa-1">
                        <v-text-field
                          v-model="listItem.a_namaSendiri"
                          label="Nama Sendiri"
                          outlined
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="3" md="3" class="pa-1">
                        <v-text-field
                          v-model="listItem.a_namaAyah"
                          label="Nama Ayah"
                          outlined
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="3" md="3" class="pa-1">
                        <v-select
                          v-model="listItem.a_kode_desa"
                          :items="itemsDesa"
                          item-text="namaDesaKecamatan"
                          item-value="kode_desa"
                          label="Desa"
                          outlined
                          clearable
                        ></v-select>
                      </v-col>
                      <v-col cols="12" sm="3" md="3" class="pa-1">
                        <v-select
                          v-model="listItem.a_respond_to_programs"
                          :items="itemsMinat"
                          item-value="respond_to_programs"
                          item-text="name"
                          label="Pilih Minat"
                          outlined
                          clearable
                        ></v-select>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12" sm="3" md="3" class="pa-1">
                        <v-select
                          v-model="listItem.a_tree1"
                          :items="Trees"
                          item-value="tree_code"
                          item-text="tree_name"
                          label="Pilih Pohon 1"
                          outlined
                          clearable
                        ></v-select>
                      </v-col>
                      <v-col cols="12" sm="3" md="3" class="pa-1">
                        <v-select
                          v-model="listItem.a_tree2"
                          :items="Trees"
                          item-value="tree_code"
                          item-text="tree_name"
                          label="Pilih Pohon 2"
                          outlined
                          clearable
                        ></v-select>
                      </v-col>
                      <v-col cols="12" sm="3" md="3" class="pa-1">
                        <v-select
                          v-model="listItem.a_tree3"
                          :items="Trees"
                          item-text="tree_name"
                          item-value="tree_code"
                          label="Pilih Pohon 3"
                          outlined
                          clearable
                        ></v-select>
                      </v-col>
                      <v-col cols="12" sm="3" md="3" class="pa-1">
                        <v-select
                          v-model="listItem.a_tree4"
                          :items="Trees"
                          item-value="tree_code"
                          item-text="tree_name"
                          label="Pilih Pohon 4"
                          outlined
                          clearable
                        ></v-select>
                      </v-col>
                    </v-row>
                    <v-row class="mt-1">
                      <v-col cols="12" sm="12" md="12" class="pa-1">
                        <v-text-field
                          v-model="listItem.a_alamat"
                          label="Alamat"
                          outlined
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-row>
                  <v-divider class="mb-8"></v-divider>
                  <v-row class="my-1">
                    <v-row>
                      <v-col cols="12" sm="3" md="3" class="pa-1">
                        <v-text-field
                          v-model="listItem.b_namaSendiri"
                          label="Nama Sendiri"
                          outlined
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="3" md="3" class="pa-1">
                        <v-text-field
                          v-model="listItem.b_namaAyah"
                          label="Nama Ayah"
                          outlined
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="3" md="3" class="pa-1">
                        <v-select
                          v-model="listItem.b_kode_desa"
                          :items="itemsDesa"
                          item-text="name"
                          item-value="kode_desa"
                          label="Desa"
                          outlined
                          clearable
                        ></v-select>
                      </v-col>
                      <v-col cols="12" sm="3" md="3" class="pa-1">
                        <v-select
                          v-model="listItem.b_respond_to_programs"
                          :items="itemsMinat"
                          item-value="respond_to_programs"
                          item-text="name"
                          label="Pilih Minat"
                          outlined
                          clearable
                        ></v-select>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12" sm="3" md="3" class="pa-1">
                        <v-select
                          v-model="listItem.b_tree1"
                          :items="Trees"
                          item-value="tree_code"
                          item-text="tree_name"
                          label="Pilih Pohon 1"
                          outlined
                          clearable
                        ></v-select>
                      </v-col>
                      <v-col cols="12" sm="3" md="3" class="pa-1">
                        <v-select
                          v-model="listItem.b_tree2"
                          :items="Trees"
                          item-value="tree_code"
                          item-text="tree_name"
                          label="Pilih Pohon 2"
                          outlined
                          clearable
                        ></v-select>
                      </v-col>
                      <v-col cols="12" sm="3" md="3" class="pa-1">
                        <v-select
                          v-model="listItem.b_tree3"
                          :items="Trees"
                          item-text="tree_name"
                          item-value="tree_code"
                          label="Pilih Pohon 3"
                          outlined
                          clearable
                        ></v-select>
                      </v-col>
                      <v-col cols="12" sm="3" md="3" class="pa-1">
                        <v-select
                          v-model="listItem.b_tree4"
                          :items="Trees"
                          item-value="tree_code"
                          item-text="tree_name"
                          label="Pilih Pohon 4"
                          outlined
                          clearable
                        ></v-select>
                      </v-col>
                    </v-row>
                    <v-row class="mt-1">
                      <v-col cols="12" sm="12" md="12" class="pa-1">
                        <v-text-field
                          v-model="listItem.b_alamat"
                          label="Alamat"
                          outlined
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-row>
                  <v-divider class="mb-8"></v-divider>
                  <v-row class="my-1">
                    <v-row>
                      <v-col cols="12" sm="3" md="3" class="pa-1">
                        <v-text-field
                          v-model="listItem.c_namaSendiri"
                          label="Nama Sendiri"
                          outlined
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="3" md="3" class="pa-1">
                        <v-text-field
                          v-model="listItem.c_namaAyah"
                          label="Nama Ayah"
                          outlined
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="3" md="3" class="pa-1">
                        <v-select
                          v-model="listItem.c_kode_desa"
                          :items="itemsDesa"
                          item-text="name"
                          item-value="kode_desa"
                          label="Desa"
                          outlined
                          clearable
                        ></v-select>
                      </v-col>
                      <v-col cols="12" sm="3" md="3" class="pa-1">
                        <v-select
                          v-model="listItem.c_respond_to_programs"
                          :items="itemsMinat"
                          item-value="respond_to_programs"
                          item-text="name"
                          label="Pilih Minat"
                          outlined
                          clearable
                        ></v-select>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12" sm="3" md="3" class="pa-1">
                        <v-select
                          v-model="listItem.c_tree1"
                          :items="Trees"
                          item-value="tree_code"
                          item-text="tree_name"
                          label="Pilih Pohon 1"
                          outlined
                          clearable
                        ></v-select>
                      </v-col>
                      <v-col cols="12" sm="3" md="3" class="pa-1">
                        <v-select
                          v-model="listItem.c_tree2"
                          :items="Trees"
                          item-value="tree_code"
                          item-text="tree_name"
                          label="Pilih Pohon 2"
                          outlined
                          clearable
                        ></v-select>
                      </v-col>
                      <v-col cols="12" sm="3" md="3" class="pa-1">
                        <v-select
                          v-model="listItem.c_tree3"
                          :items="Trees"
                          item-text="tree_name"
                          item-value="tree_code"
                          label="Pilih Pohon 3"
                          outlined
                          clearable
                        ></v-select>
                      </v-col>
                      <v-col cols="12" sm="3" md="3" class="pa-1">
                        <v-select
                          v-model="listItem.c_tree4"
                          :items="Trees"
                          item-value="tree_code"
                          item-text="tree_name"
                          label="Pilih Pohon 4"
                          outlined
                          clearable
                        ></v-select>
                      </v-col>
                    </v-row>
                    <v-row class="mt-1">
                      <v-col cols="12" sm="12" md="12" class="pa-1">
                        <v-text-field
                          v-model="listItem.c_alamat"
                          label="Alamat"
                          outlined
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-row>
                  <v-divider class="mb-8"></v-divider>
                  <v-row class="my-1">
                    <v-row>
                      <v-col cols="12" sm="3" md="3" class="pa-1">
                        <v-text-field
                          v-model="listItem.d_namaSendiri"
                          label="Nama Sendiri"
                          outlined
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="3" md="3" class="pa-1">
                        <v-text-field
                          v-model="listItem.d_namaAyah"
                          label="Nama Ayah"
                          outlined
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="3" md="3" class="pa-1">
                        <v-select
                          v-model="listItem.d_kode_desa"
                          :items="itemsDesa"
                          item-text="name"
                          item-value="kode_desa"
                          label="Desa"
                          outlined
                          clearable
                        ></v-select>
                      </v-col>
                      <v-col cols="12" sm="3" md="3" class="pa-1">
                        <v-select
                          v-model="listItem.d_respond_to_programs"
                          :items="itemsMinat"
                          item-value="respond_to_programs"
                          item-text="name"
                          label="Pilih Minat"
                          outlined
                          clearable
                        ></v-select>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12" sm="3" md="3" class="pa-1">
                        <v-select
                          v-model="listItem.d_tree1"
                          :items="Trees"
                          item-value="tree_code"
                          item-text="tree_name"
                          label="Pilih Pohon 1"
                          outlined
                          clearable
                        ></v-select>
                      </v-col>
                      <v-col cols="12" sm="3" md="3" class="pa-1">
                        <v-select
                          v-model="listItem.d_tree2"
                          :items="Trees"
                          item-value="tree_code"
                          item-text="tree_name"
                          label="Pilih Pohon 2"
                          outlined
                          clearable
                        ></v-select>
                      </v-col>
                      <v-col cols="12" sm="3" md="3" class="pa-1">
                        <v-select
                          v-model="listItem.d_tree3"
                          :items="Trees"
                          item-text="tree_name"
                          item-value="tree_code"
                          label="Pilih Pohon 3"
                          outlined
                          clearable
                        ></v-select>
                      </v-col>
                      <v-col cols="12" sm="3" md="3" class="pa-1">
                        <v-select
                          v-model="listItem.d_tree4"
                          :items="Trees"
                          item-value="tree_code"
                          item-text="tree_name"
                          label="Pilih Pohon 4"
                          outlined
                          clearable
                        ></v-select>
                      </v-col>
                    </v-row>
                    <v-row class="mt-1">
                      <v-col cols="12" sm="12" md="12" class="pa-1">
                        <v-text-field
                          v-model="listItem.d_alamat"
                          label="Alamat"
                          outlined
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">
                  Cancel
                </v-btn>
                <v-btn color="blue darken-1" text @click="saveAdd">
                  Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <!-- Modal Detail -->
          <v-dialog v-model="dialogDetail" max-width="800px">
            <v-card>
              <v-card-title class="mb-1 headermodalstyle">
                <span class="headline">Detail Form Minat Petani</span>
              </v-card-title>
              <v-divider></v-divider>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="12" md="6">
                      <div>
                        <h5>Nama</h5>
                        <h2 class="ml-2">
                          {{ defaultItem.name }}
                        </h2>
                      </div>
                    </v-col>
                    <v-col cols="12" sm="12" md="6">
                      <div>
                        <h5>Minat</h5>
                        <h2 class="ml-2">
                          {{ defaultItem.respond_to_programs }}
                        </h2>
                      </div>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" sm="12" md="6">
                      <div>
                        <h5>Desa</h5>
                        <h2 class="ml-2">
                          {{ defaultItem.namaDesa }}
                        </h2>
                      </div>
                    </v-col>
                    <v-col cols="12" sm="12" md="6">
                      <div>
                        <h5>Form Input</h5>
                        <h2 class="ml-2">
                          {{ defaultItem.form_date }}
                        </h2>
                      </div>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" sm="12" md="12">
                      <div>
                        <h5>Alamat</h5>
                        <h2 class="ml-2">{{ defaultItem.alamat }}</h2>
                      </div>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" sm="12" md="12">
                      <div>
                        <h5>Pohon yang diminati</h5>
                        <h2 class="ml-2">{{ defaultItem.namaPohon }}</h2>
                      </div>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
            </v-card>
          </v-dialog>

          <!-- Modal Add, Edit -->
          <v-dialog v-model="dialog" max-width="500px">
            <v-card>
              <v-form ref="form" v-model="valid" lazy-validation>
                <v-card-title>
                  <span class="headline">{{ formTitle }}</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="6" md="6">
                        <v-text-field
                          v-model="defaultItem.namaSendiri"
                          label="Nama Sendiri"
                          :rules="[(v) => !!v || 'Field is required']"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-text-field
                          v-model="defaultItem.namaAyah"
                          label="Nama Ayah"
                          :rules="[(v) => !!v || 'Field is required']"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12" sm="6" md="6">
                        <v-select
                          v-model="defaultItem.kode_desa"
                          :items="itemsDesa"
                          item-value="kode_desa"
                          item-text="namaDesaKecamatan"
                          label="Pilih Desa"
                          clearable
                          :rules="[(v) => !!v || 'Field is required']"
                        ></v-select>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-select
                          v-model="defaultItem.respond_to_programs"
                          :items="itemsMinat"
                          item-value="respond_to_programs"
                          item-text="name"
                          label="Pilih Minat"
                          clearable
                          :rules="[(v) => !!v || 'Field is required']"
                        ></v-select>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12" sm="12" md="12">
                        <v-textarea
                          v-model="defaultItem.alamat"
                          label="Alamat"
                          :rules="[(v) => !!v || 'Field is required']"
                          rows="2"
                        ></v-textarea>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12" sm="6" md="6">
                        <v-select
                          v-model="defaultItem.tree1"
                          :items="Trees"
                          item-value="tree_code"
                          item-text="tree_name"
                          label="Pilih Pohon 1"
                          clearable
                          :rules="[(v) => !!v || 'Field is required']"
                        ></v-select>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-select
                          v-model="defaultItem.tree2"
                          :items="Trees"
                          item-value="tree_code"
                          item-text="tree_name"
                          label="Pilih Pohon 2"
                          clearable
                        ></v-select>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12" sm="6" md="6">
                        <v-select
                          v-model="defaultItem.tree3"
                          :items="Trees"
                          item-value="tree_code"
                          item-text="tree_name"
                          label="Pilih Pohon 3"
                          clearable
                        ></v-select>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-select
                          v-model="defaultItem.tree4"
                          :items="Trees"
                          item-value="tree_code"
                          item-text="tree_name"
                          label="Pilih Pohon 4"
                          clearable
                        ></v-select>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12" sm="6" md="6">
                        <v-select
                          v-model="defaultItem.tree5"
                          :items="Trees"
                          item-value="tree_code"
                          item-text="tree_name"
                          label="Pilih Pohon 5"
                          clearable
                        ></v-select>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="close">
                    Cancel
                  </v-btn>
                  <v-btn color="blue darken-1" text @click="save"> Save </v-btn>
                </v-card-actions>
              </v-form>
            </v-card>
          </v-dialog>

          <!-- Modal Delete -->
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="headline"
                >Are you sure you want to delete this item?</v-card-title
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete"
                  >Cancel</v-btn
                >
                <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                  >OK</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon class="mr-3" @click="showDetail(item)" small color="info">
          mdi-information-outline
        </v-icon>
        <v-icon
          v-if="roleuser == 19"
          class="mr-2"
          @click="editItem(item)"
          color="warning"
        >
          mdi-pencil
        </v-icon>
        <v-icon v-if="roleuser == 19" @click="deleteItem(item)" color="red">
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>

    <v-snackbar
      v-model="snackbar"
      :color="colorsnackbar"
      :timeout="timeoutsnackbar"
    >
      {{ textsnackbar }}
    </v-snackbar>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "FormMinat",
  data: () => ({
    itemsbr: [
      {
        text: "Main Data",
        disabled: true,
        href: "breadcrumbs_dashboard",
      },
      {
        text: "Form Minat",
        disabled: true,
        href: "breadcrumbs_link_1",
      },
    ],
    alerttoken: false,
    formTitle: "Add Item",
    value: "add",
    dialog: false,
    dialogAdd: false,
    dialogDelete: false,
    dialogDetail: false,
    loadtable: false,
    load: false,
    search: "",
    authtoken: "",
    BaseUrlGet: "",
    dataobject: [],
    User: [],
    roleuser: "",
    Trees: [],
    itemsDesa: [],
    itemsMinat: [
      { name: "Berminat", respond_to_programs: "berminat" },
      { name: "Ragu-Ragu", respond_to_programs: "ragu-ragu" },
      { name: "Belum Berminat", respond_to_programs: "belum_berminat" },
    ],
    headers: [
      {
        text: "Nama Petani",
        align: "start",
        value: "name",
        width: "25%",
      },
      { text: "Desa", value: "namaDesa", width: "20%" },
      { text: "Minat", value: "respond_to_programs", width: "20%" },
      { text: "Form Input", value: "form_date", width: "20%" },
      { text: "Actions", value: "actions", sortable: false, width: "15%" },
    ],
    defaultItem: {
      id: "",
      form_date: "",
      form_date_all: "",
      name: "",
      namaSendiri: "",
      namaAyah: "",
      alamat: "",
      respond_to_programs: null,
      kode_desa: null,
      namaDesa: "",
      tree1: null,
      namaPohon: "",
      tree2: "",
      tree3: "",
      tree4: "",
      tree5: "",
    },
    listItem: {
      id: "",
      a_name: "",
      a_namaSendiri: "",
      a_namaAyah: "",
      a_alamat: "",
      a_respond_to_programs: null,
      a_kode_desa: null,
      a_namaDesa: "",
      a_tree1: null,
      a_namaPohon: "",
      a_tree2: null,
      a_tree3: null,
      a_tree4: null,
      a_tree5: null,

      b_name: "",
      b_namaSendiri: "",
      b_namaAyah: "",
      b_alamat: "",
      b_respond_to_programs: null,
      b_kode_desa: null,
      b_namaDesa: "",
      b_tree1: null,
      b_namaPohon: "",
      b_tree2: null,
      b_tree3: null,
      b_tree4: null,
      b_tree5: null,

      c_name: "",
      c_namaSendiri: "",
      c_namaAyah: "",
      c_alamat: "",
      c_respond_to_programs: null,
      c_kode_desa: null,
      c_namaDesa: "",
      c_tree1: null,
      c_namaPohon: "",
      c_tree2: null,
      c_tree3: null,
      c_tree4: null,
      c_tree5: null,

      d_name: "",
      d_anamaSendiri: "",
      d_namaAyah: "",
      d_alamat: "",
      d_respond_to_programs: null,
      d_kode_desa: null,
      d_namaDesa: "",
      d_tree1: null,
      d_namaPohon: "",
      d_tree2: null,
      d_tree3: null,
      d_tree4: null,
      d_tree5: null,
    },

    valid: true,

    snackbar: false,
    textsnackbar: "Test",
    timeoutsnackbar: 2000,
    colorsnackbar: null,
  }),
  mounted() {
    this.authtoken = localStorage.getItem("token");
    this.User = JSON.parse(localStorage.getItem("User"));
    this.BaseUrlGet = localStorage.getItem("BaseUrlGet");
    this.roleuser = this.User.role;
    this.initialize();
    this.getDesaAll();
    this.getTrees();
    this.$store.state.maintenanceOverlay = true
    // localStorage.setItem("token", this.authtoken);
    // this.getMU();
  },
  destroyed() {
    this.$store.state.maintenanceOverlay = false

    this.$store.state.loadingOverlay = false
    this.$store.state.loadingOverlayText = null
  },
  methods: {
    async initialize() {
      this.loadtable = true;
      try {
        const response = await axios.get(
          this.BaseUrlGet +
            "GetFormMinatAllAdmin?typegetdata=" +
            this.User.fc.value_data +
            "&fc=" +
            this.User.fc.fc,
          {
            headers: {
              Authorization: `Bearer ` + this.authtoken,
            },
          }
        );
        // console.log(response.data.data.result.data);
        if (response.data.length != 0) {
          this.dataobject = response.data.data.result.data;
          this.loadtable = false;
        } else {
          console.log("Kosong");
          this.loadtable = false;
        }
      } catch (error) {
        console.error(error);
        if (error.response.status == 401) {
          this.alerttoken = true;
          this.loadtable = false;
          localStorage.removeItem("token");
          this.$router.push("/");
        }
      }
    },
    async verifDelete() {
      const datapost = {
        id: this.defaultItem.id,
      };
      console.log(datapost);
      // this.dialogDetail = false;
      try {
        const response = await axios.post(
          this.BaseUrlGet + "DeleteFormMinat",
          datapost,
          {
            headers: {
              Authorization: `Bearer ` + this.authtoken,
            },
          }
        );
        console.log(response.data.data.result);
        if (response.data.data.result == "success") {
          this.dialogDelete = false;
          this.snackbar = true;
          this.colorsnackbar = "green";
          this.textsnackbar = "Sukses hapus data";
          this.initialize();
        } else {
          this.dialogDelete = false;
        }
      } catch (error) {
        console.error(error.response);
        if (error.response.status == 401) {
          this.dialogDelete = false;
        }
      }
    },
    async getDetail(item) {
      this.defaultItem.id = item.id;
      try {
        const response = await axios.get(
          this.BaseUrlGet + "GetFormMinatDetail?id=" + item.id,
          {
            headers: {
              Authorization: `Bearer ` + this.authtoken,
            },
          }
        );
        // console.log(response.data.data.result);
        if (response.data.length != 0) {
          this.defaultItem = Object.assign({}, response.data.data.result);

          this.dialogDetail = true;
          console.log(this.defaultItem.id);
          // this.itemsMU = response.data.data.result;
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
        // console.log(response.data.data.result.data);
        if (response.data.length != 0) {
          this.Trees = response.data.data.result.data;
        } else {
          console.log("Kosong");
        }
      } catch (error) {
        console.error(error);
        // if (error.response.status == 401) {
        //   this.alerttoken = true;
        // }
      }
    },
    async getDesaAll() {
      try {
        const response = await axios.get(this.BaseUrlGet + "GetDesaAdmin", {
          headers: {
            Authorization: `Bearer ` + this.authtoken,
          },
        });
        // console.log(response.data.data.result.data);
        if (response.data.length != 0) {
          this.itemsDesa = response.data.data.result;
        } else {
          console.log("Kosong");
        }
      } catch (error) {
        console.error(error);
        // if (error.response.status == 401) {
        //   this.alerttoken = true;
        // }
      }
    },
    async addData(datapost) {
      console.log(datapost);
      // this.dialogDetail = false;
      try {
        const response = await axios.post(
          this.BaseUrlGet + "AddFormMinat",
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
          this.textsnackbar = "Sukses edit data";
          this.initialize();
        } else {
          this.dialog = false;
        }
      } catch (error) {
        console.error(error.response);
        if (error.response.status == 401) {
          this.dialog = false;
        }
      }
    },
    async updateData() {
      const datapost = {
        id: this.defaultItem.id,
        name:
          this.defaultItem.namaSendiri + " bin " + this.defaultItem.namaAyah,
        form_date: this.defaultItem.form_date_all,
        alamat: this.defaultItem.alamat,
        kode_desa: this.defaultItem.kode_desa,
        respond_to_programs: this.defaultItem.respond_to_programs,
        tree1: this.defaultItem.tree1,
        tree2: this.defaultItem.tree2,
        tree3: this.defaultItem.tree3,
        tree4: this.defaultItem.tree4,
        tree5: this.defaultItem.tree5,
        user_id: this.User.employee_no,
      };
      console.log(datapost);
      // this.dialogDetail = false;
      try {
        const response = await axios.post(
          this.BaseUrlGet + "UpdateFormMinat",
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
          this.textsnackbar = "Sukses edit data";
          this.initialize();
        } else {
          this.dialog = false;
        }
      } catch (error) {
        console.error(error.response);
        if (error.response.status == 401) {
          this.dialog = false;
        }
      }
    },

    showAddListModal() {
      this.listItem.id = "";
      this.listItem.a_name = "";
      this.listItem.a_namaSendiri = "";
      this.listItem.a_namaAyah = "";
      this.listItem.a_alamat = "";
      this.listItem.a_kode_desa = null;
      this.listItem.a_respond_to_programs = null;
      this.listItem.a_tree1 = null;
      this.listItem.a_tree2 = null;
      this.listItem.a_tree3 = null;
      this.listItem.a_tree4 = null;
      this.listItem.a_tree5 = null;

      this.listItem.b_name = "";
      this.listItem.b_namaSendiri = "";
      this.listItem.b_namaAyah = "";
      this.listItem.b_alamat = "";
      this.listItem.b_kode_desa = null;
      this.listItem.b_respond_to_programs = null;
      this.listItem.b_tree1 = null;
      this.listItem.b_tree2 = null;
      this.listItem.b_tree3 = null;
      this.listItem.b_tree4 = null;
      this.listItem.b_tree5 = null;

      this.listItem.c_name = "";
      this.listItem.c_namaSendiri = "";
      this.listItem.c_namaAyah = "";
      this.listItem.c_alamat = "";
      this.listItem.c_kode_desa = null;
      this.listItem.c_respond_to_programs = null;
      this.listItem.c_tree1 = null;
      this.listItem.c_tree2 = null;
      this.listItem.c_tree3 = null;
      this.listItem.c_tree4 = null;
      this.listItem.c_tree5 = null;

      this.listItem.d_name = "";
      this.listItem.d_namaSendiri = "";
      this.listItem.d_namaAyah = "";
      this.listItem.d_alamat = "";
      this.listItem.d_kode_desa = null;
      this.listItem.d_respond_to_programs = null;
      this.listItem.d_tree1 = null;
      this.listItem.d_tree2 = null;
      this.listItem.d_tree3 = null;
      this.listItem.d_tree4 = null;
      this.listItem.d_tree5 = null;
      this.dialogAdd = true;
    },
    showAddModal() {
      this.defaultItem.id = "";
      this.defaultItem.namaSendiri = "";
      this.defaultItem.namaAyah = "";
      this.defaultItem.alamat = "";
      this.defaultItem.kode_desa = null;
      this.defaultItem.form_date_all = "";
      this.defaultItem.respond_to_programs = null;
      this.defaultItem.tree1 = null;
      this.defaultItem.tree2 = null;
      this.defaultItem.tree3 = null;
      this.defaultItem.tree4 = null;
      this.defaultItem.tree5 = null;
      this.dialog = true;
    },
    showDetail(item) {
      this.getDetail(item);
    },
    editItem(item) {
      // console.log(item);
      this.formTitle = "Edit Item";
      this.getTrees();
      this.defaultItem = Object.assign({}, item);
      var varName = item.name;
      var n = varName.search("bin");
      // console.log(n);
      this.defaultItem.namaSendiri = varName.substring(0, n);
      this.defaultItem.namaAyah = varName.substring(n + 4);
      this.value = "edit";
      this.dialog = true;
      // console.log(this.User.listDesa);
      // console.log(this.defaultItem.tree1);
    },
    deleteItem(item) {
      this.defaultItem = Object.assign({}, item);
      this.dialogDelete = true;
    },
    deleteItemConfirm() {
      this.verifDelete();
    },
    close() {
      this.dialog = false;
      this.dialogAdd = false;
    },
    closeDelete() {
      this.dialogDelete = false;
    },

    getYear(status) {
      return status.substring(1, 4);
    },

    saveAdd() {
      console.log("test1");
      var i;
      var d = new Date();
      var year = d.getFullYear();
      var month = d.getMonth() + 1;
      var date = d.getDate();
      for (i = 1; i < 5; i++) {
        if (i == 1) {
          const datapost = {
            name:
              this.listItem.a_namaSendiri + " bin " + this.listItem.a_namaAyah,
            form_date: year + "-" + month + "-" + date,
            alamat: this.listItem.a_alamat,
            kode_desa: this.listItem.a_kode_desa,
            respond_to_programs: this.listItem.a_respond_to_programs,
            tree1: this.listItem.a_tree1,
            tree2: this.listItem.a_tree2,
            tree3: this.listItem.a_tree3,
            tree4: this.listItem.a_tree4,
            tree5: this.listItem.a_tree5,
            user_id: this.User.employee_no,
          };

          if (
            this.listItem.a_namaSendiri != "" &&
            this.listItem.a_namaAyah != "" &&
            datapost.alamat != "" &&
            datapost.kode_desa != null &&
            datapost.respond_to_programs != null &&
            datapost.tree1 != null
          ) {
            this.addData(datapost);
          }
          console.log(datapost.name);
        } else if (i == 2) {
          const datapost2 = {
            name:
              this.listItem.b_namaSendiri + " bin " + this.listItem.b_namaAyah,
            form_date: year + "-" + month + "-" + date,
            alamat: this.listItem.b_alamat,
            kode_desa: this.listItem.b_kode_desa,
            respond_to_programs: this.listItem.b_respond_to_programs,
            tree1: this.listItem.b_tree1,
            tree2: this.listItem.b_tree2,
            tree3: this.listItem.b_tree3,
            tree4: this.listItem.b_tree4,
            tree5: this.listItem.b_tree5,
            user_id: this.User.employee_no,
          };
          if (
            this.listItem.b_namaSendiri != "" &&
            this.listItem.b_namaAyah != "" &&
            datapost2.alamat != "" &&
            datapost2.kode_desa != null &&
            datapost2.respond_to_programs != null &&
            datapost2.tree1 != null
          ) {
            this.addData(datapost2);
          }
        } else if (i == 3) {
          const datapost3 = {
            name:
              this.listItem.c_namaSendiri + " bin " + this.listItem.c_namaAyah,
            form_date: year + "-" + month + "-" + date,
            alamat: this.listItem.c_alamat,
            kode_desa: this.listItem.c_kode_desa,
            respond_to_programs: this.listItem.c_respond_to_programs,
            tree1: this.listItem.c_tree1,
            tree2: this.listItem.c_tree2,
            tree3: this.listItem.c_tree3,
            tree4: this.listItem.c_tree4,
            tree5: this.listItem.c_tree5,
            user_id: this.User.employee_no,
          };
          if (
            this.listItem.c_namaSendiri != "" &&
            this.listItem.c_namaAyah != "" &&
            datapost3.alamat != "" &&
            datapost3.kode_desa != null &&
            datapost3.respond_to_programs != null &&
            datapost3.tree1 != null
          ) {
            this.addData(datapost3);
          }
        } else {
          const datapost4 = {
            name:
              this.listItem.d_namaSendiri + " bin " + this.listItem.d_namaAyah,
            form_date: year + "-" + month + "-" + date,
            alamat: this.listItem.d_alamat,
            kode_desa: this.listItem.d_kode_desa,
            respond_to_programs: this.listItem.d_respond_to_programs,
            tree1: this.listItem.d_tree1,
            tree2: this.listItem.d_tree2,
            tree3: this.listItem.d_tree3,
            tree4: this.listItem.d_tree4,
            tree5: this.listItem.d_tree5,
            user_id: this.User.employee_no,
          };
          if (
            this.listItem.d_namaSendiri != "" &&
            this.listItem.d_namaAyah != "" &&
            datapost4.alamat != "" &&
            datapost4.kode_desa != null &&
            datapost4.respond_to_programs != null &&
            datapost4.tree1 != null
          ) {
            this.addData(datapost4);
          }
        }
      }
      this.close();
    },

    save() {
      this.$refs.form.validate();
      if (
        this.defaultItem.tree1 != null &&
        this.defaultItem.kode_desa != null &&
        this.defaultItem.respond_to_programs != null &&
        this.defaultItem.namaSendiri.length != 0 &&
        this.defaultItem.namaAyah.length != 0 &&
        this.defaultItem.alamat.length != 0
      ) {
        if (this.defaultItem.id) {
          console.log("edit");
          this.updateData();
        } else {
          console.log("add");

          var d = new Date();
          var year = d.getFullYear();
          var month = d.getMonth() + 1;
          var date = d.getDate();
          const datapost = {
            name:
              this.defaultItem.namaSendiri +
              " bin " +
              this.defaultItem.namaAyah,
            form_date: year + "-" + month + "-" + date,
            alamat: this.defaultItem.alamat,
            kode_desa: this.defaultItem.kode_desa,
            respond_to_programs: this.defaultItem.respond_to_programs,
            tree1: this.defaultItem.tree1,
            tree2: this.defaultItem.tree2,
            tree3: this.defaultItem.tree3,
            tree4: this.defaultItem.tree4,
            tree5: this.defaultItem.tree5,
            user_id: this.User.employee_no,
          };
          this.addData(datapost);
        }
        this.close();
      } else {
        this.snackbar = true;
        this.colorsnackbar = "red";
        this.textsnackbar =
          "Gagal Menambah, Kolom required tidak boleh ada yang kosong";
      }
    },
  },
};
</script>