<template>
    <v-dialog v-model="isOpen" width="70%">
      <template v-slot:default="{ isActive }">
        <v-card>
          <v-card-title>Perbarui Alamat Distribusi </v-card-title>
  
          <v-card-text class="ff-email-wrapper">
            <ValidationObserver ref="firstForm" v-slot="{ handleSubmit }">
              <form @submit.prevent="handleSubmit(onSubmit)" autocomplete="off">
                <v-row class="assign-ff-wrapper" v-if="socData">
                  <v-col lg="12">
                    <v-row class="mx-3 bg-grey">
                      <v-col>
                        <geko-input
                          v-model="new_address"
                          :item="{
                            type: 'text',
                            label: 'Alamat Distribusi',
                            validation: ['required'],
                            
                          }"
                        />
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
  
                <v-row>
                  <v-col lg="12" class="d-flex flex-row justify-content-center">
                    <v-btn
                      variant="warning"
                      class="d-flex flex-row align-items-center"
                      type="submit"
                    >
                      <v-icon>mdi-pencil-outline</v-icon>
                      <span>Perbarui Alamat Distribusi</span>
                    </v-btn>
                  </v-col>
                </v-row>
                <v-row> </v-row>
              </form>
            </ValidationObserver>
          </v-card-text>
        </v-card>
      </template>
    </v-dialog>
  </template>
  
  <script>
  export default {
    name: "soc-period-distribution-location",
    props: {
      data: {
        required: true,
        default: () => {},
      },
      dataKey: {
        required: true,
        default: 0,
        type: Number,
      },
    },
  
    methods: {
      onOpen() {
        
      },
  
      onSubmit() {
        let payload = {
          ff_no: this.socData.ff_no,
          program_year: this.socData.program_year,
          new_address: this.new_address
        };
        console.log(payload)
        this.$_api
        .post("new-sostam/add-on/update_distribution_address2", payload)
        .then(() => {
          this.$_alert.success("Berhasil Mengupdate Alamat Distribusi Sostam");
          this.isOpen = false;
          this.loading = false;
          this.$emit("success", true);
        })
        .catch(() => {
          this.loading = false;
        });
  
      },
    },
  
    watch: {
      dataKey(t) {
        if (t > 0) {
          this.isOpen = true;
          this.socData = this.data;
          this.new_address = this.socData.distribution_location
        }
      },
      isOpen(t) {
        console.log("open change", this.isOpen);
        if (t) {
          this.onOpen();
        } else {
          this.socData = null;
          this.loading = false;
          this.program_year = "";
          this.new_address = "";

        }
      },
    },
    data() {
      return {
        isOpen: false,
        socData: null,
        loading: false,
        program_year: "",
        new_address: "",
      };
    },
  };
  </script>
  