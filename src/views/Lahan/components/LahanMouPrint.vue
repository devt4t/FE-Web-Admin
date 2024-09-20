<template>
  <v-dialog v-model="isOpen" width="70%">
    <template>
      <v-card style="height: 90vh; overflow: auto">
        <v-card-title class="d-flex flex-row justify-content-between mb-5">
          <h4 class="mb-0 pb-0">Print MOU</h4>
          <v-btn
            large
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
            <span class="ml-1">Print MOU</span>
          </v-btn>
        </v-card-title>

        <v-card-text>
          <div
            class="preview-wrapper"
            v-if="typeof data === 'object' && Object.keys(data).length > 0"
          >
            <vue-html2pdf
              :show-layout="true"
              :float-layout="false"
              :enable-download="true"
              :preview-modal="true"
              :filename="`MOU-${data.farmer_name}-${data.mou_start}-${data.mou_end}`"
              :pdf-quality="1"
              :manual-pagination="true"
              pdf-format="a4"
              pdf-orientation="portrait"
              pdf-content-width="794px"
              :pdf-content-height="1123"
              ref="html2Pdf"
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
                  orientation: 'p',
                },
              }"
              @beforeDownload="beforeDownload($event)"
              @hasDownloaded="onDownloadComplete()"
            >
              <section slot="pdf-content">
                <mou-html :data="data" />
              </section>
            </vue-html2pdf>
          </div>
        </v-card-text>
      </v-card>
    </template>
  </v-dialog>
</template>

<script>
import VueHtml2pdf from "vue-html2pdf";
import MouHtml from "./MouHtml.vue";
import moment from "moment";
export default {
  name: "LahanMouPrint",

  components: {
    VueHtml2pdf,
    MouHtml,
  },
  props: {
    lahanData: {
      required: true,
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
  },

  methods: {
    onPrint() {
      this.loading = true;
      this.$refs.html2Pdf.generatePdf();
    },
    async onDownloadComplete() {
      console.log("DOWNLOAD COMPLETE");

      this.loading = false;
      this.$_alert.success("Mou berhasil diunduh");

      let mouData = this.mouData;
      console.log("farmer data", this.lahanData);

      let payload = {
        farmer_no: this.lahanData.farmer_no,
        program_year: this.$_config.programYear.model,
        lahan_no: this.lahanData.lahan_no,
        mou_no: this.lahanData.mou_no,
      };
      console.log("payload", payload);

      if (!mouData) {
        const insertingFarmerMou = await this.$_api
          .post("createFarmerLahanMOU_new", payload)
          .then((res) => {
            console.log("res", res);

            // return res
          });
      }

      return;
      this.$_api.post("UpdateLandMOUStatus_new", {
        lahan_no: "",
        users: "LEGAL",
        mou_status: "verification",
      });
    },
    onOpen() {
      this.isOpen = true;

      const mouStart = moment().utcOffset(7).format("DD MMMM YYYY");
      const mouEnd = moment(mouStart).add(40, "years").format("DD MMMM YYYY");

      let farmerAddress = [this.lahanData.farmers_address_pivot_farmer];

      for (const key of [
        "desa_name_farmer",
        "kecamatan_name_farmer",
        "kabupaten_name_farmer",
        "provinces_name_farmer",
        "farmers_post_code_pivot_farmer",
      ]) {
        if (![null, undefined, "-", ""].includes(this.lahanData[key])) {
          farmerAddress.push(
            this.lahanData[key]
              .toLowerCase()
              .split(" ")
              .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
              .join(" ")
          );
        }
      }
      this.data = {
        farmer_name: this.lahanData.farmers_name_pivot_farmer,
        farmer_address: farmerAddress.join(", "),
        farmer_nik: this.lahanData.farmers_ktp_no_pivot_farmer,
        mou_start: mouStart,
        mou_end: mouEnd,
        farmer_ktp_photo: `${this.$_config.baseUrlExport}${this.lahanData.farmers_ktp_document_pivot_farmer}`,
        farmer_photo: `${this.$_config.baseUrlExport}${this.lahanData.farmers_ktp_document_pivot_farmer}`,
      };
    },
    async beforeDownload({ html2pdf, options, pdfContent }) {
      console.log("options", options);

      // await html2pdf().set(options).from(pdfContent).toPdf().get("pdf").save();
    },
  },

  mounted() {},

  data() {
    return {
      isOpen: false,
      data: {},
      loading: false,
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
