<template>
  <v-dialog v-model="showModal"
      scrollable
      max-width="1000px"
      transition="dialog-transition"
      content-class="rounded-xl">
    <v-card height="100%">
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
              <!-- new data -->
              <v-col cols="12" sm="12" md="12">
                <v-text-field
                  outlined
                  hide-details
                  rounded
                  dense
                  color="success"
                  v-model="defaultItem.ff_email"
                  label="Email"
                  placeholder="Masukan Email..."
                  :rules="rules"
                >
                </v-text-field>
                <p v-if="this.dataEmail.includes(this.defaultItem.ff_email)" class="red--text">
                  <strong>
                    E-mail Sudah Terdaftar: {{ defaultItem.ff_email }}

                  </strong>
                </p>
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
            :disabled="disableSaveButton()"
            @click="SaveEditFFEmail"
            ><v-icon class="mr-1">mdi-content-save</v-icon> Simpan
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from "axios";
import Swal from 'sweetalert2'


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
  },
  ff_no:{
    type: String,
    default: ""
  },
  dataEmail: {
    type: Array,
    default: []
  }
},
data: () => ({
  showAddLahanModal: false,
  page: 1,
  itemsPerPage: 10,
  menu2: "",
  valid: true,
  itemsbr: [
    {
      text: "EditEmailFF",
      disabled: true,
      href: "breadcrumbs_dashboard",
    },
    {
      text: "EditEmailFF",
      disabled: true,
      href: "breadcrumbs_link_1",
    },
  ],
  formTitle: "Edit Email FF",
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
  switchSPPT: false,
  defaultItem: {
    ff_no: "",
    ff_email: "",
  },

  

  snackbar: false,
  textsnackbar: "Test",
  timeoutsnackbar: 2000,
  colorsnackbar: null,
  user_id: "",

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
},
methods:{
  disableSaveButton(){
    if(this.dataEmail.includes(this.defaultItem.ff_email)) return true
    return false
  },
  async SaveEditFFEmail(){
    this.defaultItem.ff_no = this.ff_no
    const confirm = await Swal.fire({
        title: 'Apa Anda Yakin?',
        text: "Anda Akan Mengubah Email FF.",
        icon: 'warning',
        confirmButtonColor: '#2e7d32',
        confirmButtonText: 'Ya',
        showCancelButton: true
    })
    if (confirm.isConfirmed){
      const dataToUpdate = {
        ff_no: this.defaultItem.ff_no,
        email: this.defaultItem.ff_email
      }
      console.log(dataToUpdate)
      const res = await axios.post(this.$store.getters.getApiUrl(`UpdateEmailFieldFacilitator`), dataToUpdate, this.$store.state.apiConfig)
      if (res) {
          this.showModal = false
          this.$emit('swal', {type: 'success', message: 'E-mail Telah di-Update!'})
      }
      console.log(res.data)
    }
    this.defaultItem.ff_email = ""
  }
}
}
</script>