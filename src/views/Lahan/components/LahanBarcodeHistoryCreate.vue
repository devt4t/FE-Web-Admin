<template>
    <v-dialog v-model="isOpen" width="70%">
      <template v-slot:default="{ isActive }">
        <v-card class="mx-auto">
            <v-card-title>Generate Barcode Lahan</v-card-title>
            <v-col md="6">
                <geko-input v-model="generate_amount" 
                :item="{
                    label: 'Jumlah Generate',
                    validation: ['required'],
                    col_size: 6,
                    type: 'number',
                }" />
            </v-col>
            <v-col>
                <v-btn
                    variant="success"
                    class="d-flex flex-row align-items-center ml-2 mt-3"
                    @click="Generate()"
                    >
                    <v-icon small>mdi-upload</v-icon>
                    <span>Generate</span>
                </v-btn>
            </v-col>
        </v-card>
      </template>
    </v-dialog>
  </template>

  
  
  <script>
  import moment from "moment";
  import axios from "axios";
  export default {
    name: "lahan-barcode-history-create",
    props: {
      dataKey: {
        required: true,
        default: 0,
        type: Number,
      },
    },
  
    methods: {
      async Generate(){
        const prompt = await this.$_alert.confirm('Melakukan Generate Nomor Lahan?', 'Harap Cek Data Dengan Teliti!, Proses Generate Data Akan Masuk History Barcode Lahan & Tidak Bisa Dihapus!', 'Ya, Generate!', 'Batal', true)
        if (prompt.isConfirmed) {
            this.$_api.post('lahan/generate-barcode/create', {generate_amount: this.generate_amount})
            .then(() => {
                this.$_alert.success('Berhasil Melakukan Generate Data Barcode Lahan, Harap Segera Export Data!')
                this.isOpen = false;
                this.$emit('success', true)
            })
        }
      },
    },
  
    watch: {
      dataKey(t) {
        if (t > 0) {
          this.isOpen = true;
        }
      },
      isOpen(t) {
        console.log("open change", this.isOpen);
        if (t) {
        } else {
          this.generate_amount = 10;
          this.loading = false;
          this.error = "";
        }
      },
    },
    data() {
      return {
        isOpen: false,
        generate_amount: 10,
        loading: false,
        error: "",
      };
    },
  };
  </script>
  