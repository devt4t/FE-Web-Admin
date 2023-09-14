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
      :items="dataObject"
      :search="table.search"
      :loading="table.loading.show"
      :loading-text="table.loading.text"
      :class="`${$store.state.theme == 'dark' ? '' : ''} rounded-xl elevation-6 mx-3 pa-1`"
      @update:page="($p) => table.pagination.current_page = $p"
      @update:items-per-page="($p) => table.pagination.per_page = $p"

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
                <p class="mb-0 white--text justify-center">
                  <v-icon color="white" class="mr-2" style="align-center"
                  >mdi-eye-outline</v-icon
                  ><strong> Tanggal Distribusi </strong>
                </p>
                <v-divider class="mx-1"></v-divider>
              </div>
            </v-col>
          </v-row>
        </v-card>
  </template>
  <template v-slot:item.index="{index}">
      {{ (table.pagination.per_page * (table.pagination.current_page-1)) + index + 1}}
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
        authtoken: "",
        BaseUrl: "",
        BaseUrlGet: "",
        program_year: "",
        dataobject: [],
        table: {
            headers: [
            { text: "No", value: "index", sortable: false, align: 'center'},
            { text: "Tahun Program", value: "program_year", sortable: false, align: 'center'},
            { text: "Tanggal Distribusi", value: "distribution_date", sortable: false, align: 'center'},
            { text: "Nomor Management Unit", value: "mu_no", sortable: false},
            { text: "Management Unit", value: "nama_mu", sortable: false},
            { text: "Nomor FF", value: "ff_no", sortable: false, align: 'center'},
            { text: "Nama FF", value: "nama_ff", sortable: false},
            { text: "Target Area", value: "target_area", sortable: false, align: 'center'},
            { text: "Nama Target Area", value: "nama_ta", sortable: false, align: 'center'},
            ],
            items: [],
            loading: {
              show: false,
              text: 'Loading...'
            },
            search: '',
            pagination: {
              current_page: 1,
              per_page: 10,
              length_page: 0,
              page_options: []
            },
          },
        
        }),
        async mounted(){
          await this.firstAccessPage();
        },
        methods: {
          async getTableData(){
            console.log('terpanggil')
            this.table.loading.show=true
            const parameters = new URLSearchParams({
              program_year: this.program_year,
              
            })
            try{
              const response = await axios.get(
                this.BaseUrlGet + 'GetDistributionSimple?'+ parameters, 
                {
                  headers: {
                    Authorization: `Bearer ` + this.authtoken,
                  },
                }
              );
              if(response.data.length != 0){
                this.dataObject = response.data.data.result
                console.log(response.data.data.result)
                
                this.table.loading.show = false;
              } else{
                this.dataObject = [];
              }
            } catch (error){
              console.error(error);
              this.dataObject= [];
              this.table.loading.show = false;
            }
          },
          async firstAccessPage(){
            this.authtoken = localStorage.getItem("token");
            this.BaseUrlGet = localStorage.getItem("BaseUrlGet");
            this.BaseUrl = localStorage.getItem("BaseUrl");
            this.program_year = this.$store.state.programYear.model

            await this.getTableData();
          }
        }
}
</script>