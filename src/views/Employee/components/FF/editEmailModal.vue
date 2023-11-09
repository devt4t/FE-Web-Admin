<template>
    <v-dialog v-model="showModal"
        scrollable
        max-width="1000px"
        transition="dialog-transition"
        content-class="rounded-xl">
      <v-card>
        <v-form ref="form" lazy-validation>
          <v-card-title class="rounded-xl green darken-3 ma-1 pa-2 white--text">
                <v-icon color="white" class="mx-2">mdi-account-details</v-icon> {{ this.formTitle }}
                <v-icon color="white" class="ml-auto" @click="showModal = false">mdi-close-circle</v-icon>
          </v-card-title>
          <v-card-text>
            <!-- Loading -->
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
            <!-- Form Content -->
            <v-container v-if="load == false">
              <v-row>
                <v-col cols="12" sm="12" md="12">
                  <v-text-field
                    outlined
                    hide-details
                    rounded
                    dense
                    color="success"
                    v-model="this.email"
                    label="E-mail"
                    placeholder="Masukan E-Mail..."
                    :rules="rules"
                  >
                  </v-text-field>
                </v-col>
               </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions v-if="load == false">
            <v-btn color="red" rounded text >
              <v-icon class="mr-1">mdi-close-circle</v-icon>
              Keluar
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
              color="green darken-1"
              class="px-5"
              rounded
              outlined
              ><v-icon class="mr-1">mdi-content-save</v-icon> Simpan
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
</template>

<script>
import axios from "axios";


export default {
  name: "TambahDataLahan",
  props: {
    show: {
      type: Boolean,
      default: false
    },
    email: {
        type: String,
        default: ""
    }
  },
  data: () => ({
    showAddLahanModal: false,
    
    formTitle: "Edit E-mail FF",
    value: "add",
    load: false,
    search: "",
    authtoken: "",
    BaseUrlGet: "",
    rules: [
      (value) => !!value || "Required.",
      (value) => (value && value.length >= 1) || "Min 1 characters",
    ],
    dataobject: [],
    defaultItem: {
      email: "",
    },
    snackbar: false,
    textsnackbar: "Test",
    timeoutsnackbar: 2000,
    colorsnackbar: null,
    user_id: "",

    itemsfc: [],
    User: [],
    um_code: "",
    fc_no_selected: "",
    RoleAccesFilterShow: true,
    RoleAccesCRUDShow: true,
    RoleAccesCRUDDelete: true,

    itemsposition: [],
  }),
  computed:{
    showModal: {
        get: function () {
          return this.show
        },
        set: function(newVal) {
          if (!newVal) {
              this.$emit('close', false)
          }else{
          }
        }
    },
  }
}
</script>