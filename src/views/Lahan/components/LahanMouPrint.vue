<template>
  <div>
    <!-- main dialog -->
    <v-dialog v-model="isOpen" width="850" scrollable>
      <v-card>
        <v-card-title class="d-flex flex-row justify-content-between mb-5">
          <h4 class="mb-0 pb-0" v-if="openFormUpload">
            {{ formUploadPreview ? "Preview" : "Upload" }} Lampiran
          </h4>
          <h4 class="mb-0 pb-0" v-else>Preview MOU</h4>

          <div class="d-flex" v-if="!openFormUpload">
            <!-- btn print -->
            <v-btn
              small
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
              <span class="ml-1"
                >Print
                {{ mouData && mouData.printed_status ? "Ulang" : "" }}
                MOU</span
              >
            </v-btn>
            <!-- btn verifikasi -->

            <!-- btn revision -->
            <v-btn
              v-if="!mouData || mouData.mou_status == 0"
              small
              variant="warning"
              class="d-flex flex-row align-items-center ml-2"
              @click="() => (dialogs.revision.isOpen = true)"
            >
              <v-progress-circular
                v-if="loading"
                indeterminate
                :size="20"
                color="warning"
              ></v-progress-circular>
              <v-icon v-else>mdi-file-edit-outline</v-icon>
              <span class="ml-1">Revisi MOU</span>
            </v-btn>
            <!-- btn upload berkas -->
            <v-btn
              v-if="
                mouData && mouData.printed_status && mouData.mou_status != 5
              "
              :disabled="loading"
              small
              variant="warning"
              class="d-flex flex-row align-items-center ml-2"
              @click="
                openFormUpload = true;
                formUploadPreview = false;
              "
            >
              <v-icon>mdi-file-alert-outline</v-icon>
              <span class="ml-1">Upload Berkas</span>
            </v-btn>
            <!-- btn preview berkas -->
            <v-btn
              v-if="
                mouData &&
                mouData.printed_status &&
                [4, 5].includes(mouData.mou_status)
              "
              :disabled="loading"
              small
              variant="success"
              class="d-flex flex-row align-items-center ml-2"
              @click="
                openFormUpload = true;
                formUploadPreview = true;
              "
            >
              <v-icon>mdi-file-eye-outline</v-icon>
              <span class="ml-1">Preview Berkas</span>
            </v-btn>
          </div>
        </v-card-title>
        <v-card-text>
          <v-alert
            v-if="mouData && mouData.printed_at && !openFormUpload"
            dense
            text
            icon="mdi-printer-check"
            type="info"
          >
            {{ mouData.printed_at | parse("datetime") }}
          </v-alert>
          <!-- revision desc -->
          <v-alert
            v-if="mouData && mouData.mou_status == 2"
            dense
            text
            icon="mdi-alert-circle-outline"
            type="warning"
          >
            Revisi: {{ mouData.mou_revision_reason }}
          </v-alert>
          <!-- FormUploadAttachmentMOU -->
          <FormUploadAttachmentMOU
            v-if="openFormUpload"
            :mouData="mouData"
            :lahanData="lahanData"
            :preview="formUploadPreview"
            @close="openFormUpload = false"
            @closeParent="isOpen = false"
            @refreshData="refreshDetailLahan()"
          />
          <!-- MOU -->
          <div
            class="preview-wrapper"
            v-else-if="typeof data === 'object' && Object.keys(data).length > 0"
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
    </v-dialog>
    <!-- revision dialog -->
    <v-dialog v-model="dialogs.revision.isOpen" width="500">
      <v-card>
        <v-card-title>
          <h4 class="mb-0 pb-0">Confirm Revision</h4>
        </v-card-title>
        <v-card-text>
          <ValidationObserver ref="revisionForm" v-slot="{ handleSubmit }">
            <form
              @submit.prevent="handleSubmit(onSubmitRevisi)"
              autocomplete="off"
            >
              <geko-input
                v-model="dialogs.revision.data.mou_revision_reason"
                class="mb-5"
                :item="{
                  label: 'Deskripsi Revisi',
                  validation: ['required'],
                  type: 'textarea',
                }"
              />
              <v-btn type="submit" variant="success" :disabled="loading">
                <v-progress-circular
                  v-if="loading"
                  indeterminate
                  :size="20"
                  color="success"
                ></v-progress-circular>
                <v-icon v-else>mdi-content-save</v-icon>
                Submit Revisi
              </v-btn>
            </form>
          </ValidationObserver>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import VueHtml2pdf from "vue-html2pdf";
import MouHtml from "./MouHtml.vue";
import moment from "moment";
import FormUploadAttachmentMOU from "./FormUploadAttachmentMOU.vue";
export default {
  name: "LahanMouPrint",

  components: {
    VueHtml2pdf,
    MouHtml,
    FormUploadAttachmentMOU,
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
      try {
        console.log("DOWNLOAD COMPLETE");

        // update status printed
        await this.updateFarmerMOUPrint();

        this.loading = false;
        this.$_alert.success("Mou berhasil diunduh");

        let mouData = this.mouData;
        console.log("mouData", this.mouData);
        console.log("farmer data", this.lahanData);

        return;
      } catch (err) {
        console.log("onDownloadComplete() error", err);
      }
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
        farmer_ktp_photo: `${this.$_config.baseUrlUpload}/${this.lahanData.farmers_ktp_document_pivot_farmer}`,
        farmer_photo: `${this.$_config.baseUrlUpload}/${this.lahanData.farmers_ktp_document_pivot_farmer}`,
      };

      // default opened modal
      if (this.mouData && [1, 4, 5].includes(this.mouData.mou_status)) {
        this.openFormUpload = true;
        if ([4, 5].includes(this.mouData.mou_status))
          this.formUploadPreview = true;
      } else this.openFormUpload = false;
    },
    onSubmitRevisi: async function () {
      if (!this.dialogs.revision.data.mou_revision_reason) return;
      this.loading = true;
      // update print status
      await this.updateFarmerMOUPrint({
        mou_reject_reason: this.dialogs.revision.data.mou_revision_reason,
      });
      this.dialogs.revision.isOpen = false;
      this.dialogs.revision.data.mou_revision_reason = null;
      this.isOpen = false;
      this.loading = false;
    },
    async beforeDownload({ html2pdf, options, pdfContent }) {
      console.log("options", options);

      // await html2pdf().set(options).from(pdfContent).toPdf().get("pdf").save();
    },
    updateFarmerMOUPrint: async function (param = {}) {
      try {
        let payload = {
          farmer_no: this.lahanData.farmer_no,
          program_year: this.$_config.programYear.model,
          lahan_no: this.lahanData.lahan_no,
          mou_no: this.lahanData.farmers_mou_no_pivot_farmer,
          ...param,
        };
        console.log("payload", payload);

        // update print status
        const { result: res } = await this.$_api.post(
          "farmer-mou/print",
          payload
        );
        console.log("res", res);

        // update local data
        this.refreshDetailLahan();

        return res;
      } catch (err) {
        console.log("updateFarmerMOUPrint() error", err);
      }
    },
    refreshDetailLahan() {
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
      formUploadPreview: false,
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
