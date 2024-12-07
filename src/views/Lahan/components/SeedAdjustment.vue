<template>
    <div>
        <!-- main dialog -->
        <v-dialog v-model="isOpen" width="850" scrollable>
            <v-card>
                <v-card-title class="d-flex flex-row justify-content-between mb-5">
                    <h4 class="mb-0 pb-0" v-if="openFormUpload">
                        {{ formUploadPreview ? "Preview" : "Upload" }} Lampiran
                    </h4>

                    <div class="d-flex">
                        <!-- btn print -->
                        <v-btn small variant="primary" class="d-flex flex-row align-items-center" @click="onPrint">
                            <v-progress-circular v-if="loading" indeterminate :size="20"
                                color="primary"></v-progress-circular>
                            <v-icon v-else>mdi-printer-outline</v-icon>
                            <span class="ml-1">Print
                                {{ mouData && mouData.printed_status ? "Ulang" : "" }}
                                MOU</span>
                        </v-btn>
                        <!-- btn revision -->
                        <v-btn v-if="
                            (mouData && mouData.mou_status == 0) || (mouData && !mouData.id)
                        " small variant="warning" class="d-flex flex-row align-items-center ml-2"
                            @click="() => (dialogs.revision.isOpen = true)">
                            <v-progress-circular v-if="loading" indeterminate :size="20"
                                color="warning"></v-progress-circular>
                            <v-icon v-else>mdi-file-edit-outline</v-icon>
                            <span class="ml-1">Revisi MOU</span>
                        </v-btn>
                        <!-- btn upload lampiran -->
                        <v-btn v-if="
                            mouData && mouData.printed_status && mouData.mou_status != 5
                        " :disabled="loading" small variant="warning" class="d-flex flex-row align-items-center ml-2" @click="
                openFormUpload = true;
            formUploadPreview = false;
            ">
                            <v-icon>mdi-file-alert-outline</v-icon>
                            <span class="ml-1">Upload Lampiran</span>
                        </v-btn>
                        <!-- btn preview lampiran -->
                        <v-btn v-if="
                            mouData &&
                            mouData.printed_status &&
                            [4, 5].includes(mouData.mou_status)
                        " :disabled="loading" small variant="success" class="d-flex flex-row align-items-center ml-2" @click="
                openFormUpload = true;
            formUploadPreview = true;
            ">
                            <v-icon>mdi-file-eye-outline</v-icon>
                            <span class="ml-1">Preview Lampiran</span>
                        </v-btn>
                    </div>
                </v-card-title>
                <v-card-text class="pt-5">
                    <v-alert v-if="mouData && mouData.printed_at && !openFormUpload" dense text icon="mdi-printer-check"
                        type="info">
                        {{ mouData.printed_at | parse("datetime") }}
                    </v-alert>
                    <!-- revision desc -->
                    <v-alert v-if="mouData && mouData.mou_status == 2" dense text icon="mdi-alert-circle-outline"
                        type="warning">
                        Revisi: {{ mouData.mou_revision_reason }}
                    </v-alert>
                    <!-- FormUploadAttachmentMOU -->
                    <FormUploadAttachmentMOU v-if="openFormUpload" :mouData="mouData" :lahanData="lahanData"
                        :preview="formUploadPreview" @close="openFormUpload = false" @closeParent="isOpen = false"
                        @refreshData="refreshDetailLahan()" @openPrintAppendix="openPrintAppendix" />
                    <!-- MOU -->
                    <div class="preview-wrapper" v-else-if="typeof data === 'object' && Object.keys(data).length > 0">
                        <vue-html2pdf :show-layout="true" :float-layout="false" :enable-download="true"
                            :preview-modal="true" :pdf-quality="1" :manual-pagination="true" pdf-format="a4"
                            pdf-orientation="portrait" pdf-content-width="794px" :pdf-content-height="1123"
                            ref="html2Pdf" :html-to-pdf-options="{
                                margin: 0,
                                filename: `MOU-${data.farmer_name}`,
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
                            }" @beforeDownload="beforeDownload($event)" @hasDownloaded="onDownloadComplete()">
                            <section slot="pdf-content">
                                <mou-html :data="data" />
                            </section>
                        </vue-html2pdf>
                    </div>
                </v-card-text>
            </v-card>
        </v-dialog>
        <!-- revision dialog -->
    </div>
</template>

<script>
import VueHtml2pdf from "vue-html2pdf";
import MouHtml from "./MouHtml.vue";
import moment from "moment";
import axios from 'axios'
import FormUploadAttachmentMOU from "./FormUploadAttachmentMOU.vue";
export default {
    name: "SeedAdjustment",

    props: {
        trees: {
            required: true,
        },
        modalKey: {
            type: Number,
            default: 0,
            required: true,
        },
    },

    methods: {
        onOpen() {
            this.isOpen = true;


        },
    },

    mounted() { },

    data() {
        return {
            isOpen: false,
            data: [],
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