<template>
    <div> 
    <v-breadcrumbs
    :dark="$store.state.theme == 'dark'"
      data-aos="fade-right"
      class="breadcrumbsmain"
      :items="breadcrumbs"
      divider=">"
      large
    ></v-breadcrumbs>

    

    <v-data-table
      data-aos="fade-up"
      data-aos-delay="200"
      multi-sort
      :headers="table.headers"
      :items="table.items"
      :search="table.search"
      :loading="table.loading.show"
      :loading-text="table.loading.text"
      :class="`${$store.state.theme == 'dark' ? '' : ''} rounded-xl elevation-6 mx-3 pa-1`"
      :footer-props="{
            itemsPerPageText: 'Jumlah Data Per Halaman',
            itemsPerPageOptions: [10, 25, 40, -1],
            showCurrentPage: true,
            showFirstLastPage: true,
          }"
  >
  <template v-slot:top class="py-4">
        <v-card class="rounded-xl shadow-lg" color="green">
          <v-row class="ma-0 mx-2">
            <v-col cols="12">
              <div class="d-flex align-center">
                <v-divider class="mx-1"></v-divider>
                <p class="mb-0 white--text justify-center">
                  <v-icon color="white" class="mr-2" style="align-center"
                  >mdi-eye-outline</v-icon
                  ><strong> Tanggal Distribusi </strong>
                </p>
              </div>
            </v-col>
          </v-row>
        </v-card>
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
import Swal from 'sweetalert2'
import axios from "axios";
import moment from "moment";
import LottieAnimation from 'lottie-web-vue';

export default {
    name: "viewDistribution",
    components: {
        LottieAnimation,
    },
    data: () => ({
        textsnackbar: "Test",
        BaseUrl: "",
        BaseUrlGet: "",
        table: {
            headers: [
            { text: "No", value: "index", sortable: false, align: 'center'},
            { text: "Distribution Date", value: "distribution_date", sortable: false},
            { text: "Management Unit", value: "nama_mu", sortable: false},
            { text: "Jumlah FF", value: "ff_count", sortable: false},
            ],
            items: [],
            loading: {
            show: false,
            text: 'Loading...'
            },
            search: '',
            },
        
        })
}
</script>