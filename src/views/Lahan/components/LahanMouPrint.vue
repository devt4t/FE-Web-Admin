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
            <v-icon>mdi-printer-outline</v-icon>
            <span>Print MOU</span>
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
  },

  methods: {
    onPrint() {
      this.loading = true;
      this.$refs.html2Pdf.generatePdf();
    },
    onDownloadComplete() {
      this.loading = false;
      this.$_alert.success("Mou berhasil diunduh");

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

      console.log("data", this.data);
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
