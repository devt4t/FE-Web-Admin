<template>
  <div>
    <!-- main dialog -->
    <v-dialog v-model="isOpen" width="90%">
      <template>
        <v-card style="height: 90vh; overflow: auto">
          <v-card-title class="d-flex flex-row justify-content-between mb-5">
            <h4 class="mb-0 pb-0">Preview Appendix Lahan</h4>

            <div class="d-flex">
              <!-- btn print -->
              <v-btn
                largew
                variant="primary"
                class="d-flex flex-row align-items-center"
                @click="onPrint"
              >
                <v-progress-circular
                  v-if="loading"
                  indeterminate
                  :size="20"
                  color="primary"
                ></v-progress-circular>
                <v-icon v-else>mdi-printer-outline</v-icon>
                <span class="ms-1">Print Appendix</span>
              </v-btn>
            </div>
          </v-card-title>
          <v-card-text>
            <div class="preview-wrapper">
              <vue-html2pdf
                :show-layout="true"
                :float-layout="false"
                :enable-download="true"
                :preview-modal="true"
                :filename="`MOU-${data.farmer_name}-${data.mou_start}-${data.mou_end}`"
                :pdf-quality="1"
                :manual-pagination="true"
                pdf-format="a4"
                pdf-orientation="landscape"
                pdf-content-width="1123px"
                pdf-content-height="794px"
                ref="html2Pdf"
                @hasDownloaded="onDownloadComplete()"
                :html-to-pdf-options="{
                  margin: 0,
                  pagebreak: {
                    mode: ['css', 'legacy'],
                    after: '.html2pdf__page-break',
                  },
                  html2canvas: {
                    scale: 3,
                    useCORS: true,
                  },
                  jsPDF: {
                    format: 'a4',
                    unit: 'mm',
                    orientation: 'l',
                  },
                }"
              >
                <section slot="pdf-content">
                  <appendix-html :data="data" />
                </section>
              </vue-html2pdf>
            </div>
          </v-card-text>
        </v-card>
      </template>
    </v-dialog>
  </div>
</template>

<script>
import VueHtml2pdf from "vue-html2pdf";
import AppendixHtml from "./MouAppendixHtml.vue";
export default {
  name: "lahan-appendix-print",

  components: {
    VueHtml2pdf,
    AppendixHtml,
  },
  props: {
    lahanData: {
      required: true,
      default: () => {},
    },
    farmerData: {
      required: false,
      default: () => {},
    },
    modalKey: {
      type: Number,
      default: 0,
      required: true,
    },
    mouData: {
      default: null,
      required: false,
    },

    imageData: {
      required: false,
      default: "",
    },
    trees: {
      required: false,
      default: [],
    },
  },

  methods: {
    onPrint() {
      this.loading = true;

      this.$_api
        .post("farmer-mou/print-appendix", {
          mou_no: this.data.mou_no,
        })
        .then(() => {
          this.$refs.html2Pdf.generatePdf();
        })
        .catch(() => {
          this.loading = false;
        });
    },
    onOpen() {
      this.data = {
        mou_no: this.lahanData.farmers_mou_no_pivot_farmer,
        polygon_image: this.imageData,
        farmer_name: this.lahanData.farmers_name,
        farmer_no: this.lahanData.farmer_no,
        project_model: this.lahanData.farmers_project_model_pivot_farmer,
        trees: this.trees,
        gis_polygon_area: this.lahanData.gis_polygon_area,
        gis_planting_area: this.lahanData.gis_planting_area,
      };

      this.isOpen = true;
    },

    onDownloadComplete() {
      this.loading = false;
      this.$parent.getData();
    },
  },

  mounted() {},

  data() {
    return {
      isOpen: false,
      data: {},
      dialogs: {
        revision: {
          isOpen: false,
          data: {},
        },
      },
      loading: false,
      openFormUpload: false,
    };
  },

  watch: {
    modalKey(t) {
      if (t > 0) {
        this.onOpen();
      }
    },
    isOpen(t) {
      if (t) {
        this.isOpen = true;
      } else {
        this.isOpen = false;
      }
    },
  },
};
</script>

<style>
.preview-wrapper .content-wrapper {
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
}
</style>
