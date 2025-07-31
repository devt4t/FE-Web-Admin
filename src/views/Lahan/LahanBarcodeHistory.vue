<template>
    <geko-base-crud :config="config" :refreshKey="refreshKey" :hideUpdate="true" :hideDelete="true" :hideCreate="true" :hideDetail="true">
        <template v-slot:list-after-filter>
            <div class="d-flex flex-row justify-content-start align-items-center pb-4">
                <v-btn class="mr-3" variant="primary" @click="onGenerateBarcodeData">
                <v-icon small class="mr-2">mdi-qrcode</v-icon>
                <span>Generate Barcode Lahan</span>
                </v-btn>
            </div>
        </template>
        <template v-slot:list-indicator="{ item }">
            <div class="indicator-wrapper pt-1">
                <div class="indicator" :class="{
                    success: item.is_printed_qty == 0,
                    warning: item.is_printed_qty > 0,
                }"></div>
            </div>
        </template> 
        <template v-slot:list-history_lahan="{ item }">
            <div class="d-flex align-items-center gap-1">
                <div class="badge bg-danger">{{ item.start_lahan_no }}</div>
                <span> - </span>
                <div class="badge bg-success">{{ item.end_lahan_no }}</div>
            </div>
        </template>
        <template v-slot:list-lahan_amount="{ item }">
            {{
                parseInt(item.end_lahan_no.replace('10_', '')) -
                parseInt(item.start_lahan_no.replace('10_', '')) + 1
            }}
        </template> 

        <template v-slot:list-bottom-action="{ item }">
            <v-btn variant="success" small class="d-flex flex-row align-items-center mt-2"
                @click="onExportData(item)">
                <v-icon small>mdi-download</v-icon>
                <span>Export Untuk Print</span>
            </v-btn>
        </template>

        <template v-slot:list-before-create>
            <lahan-barcode-history-create :dataKey="generateKey" @success="refreshKey = refreshKey + 1"></lahan-barcode-history-create>
        </template>
    </geko-base-crud>

</template>

<script>
import maintenanceAnimation from "@/assets/lottie/maintenance.json";
import LottieAnimation from "lottie-web-vue";
import lahanBarcodeHistoryConfig from "./components/config-barcode-history";
import LahanBarcodeHistoryCreate from "./components/LahanBarcodeHistoryCreate.vue";

import moment from "moment";
import axios from "axios";
export default {
    components: {
        LottieAnimation,
        LahanBarcodeHistoryCreate
    },
    name: "crud-lahan-barcode-history",
    watch: {},
    data() {
        return {
            user: {},
            refreshKey: 1,
            config: lahanBarcodeHistoryConfig,
            lottie: maintenanceAnimation,
            detailDataKey: 0,
            detailData: [],
            generateKey: 0,
            print_lable_key: 0,
            exportKey: 0,
        };
    },
    mounted() {
        const user = JSON.parse(localStorage.getItem("User"));
        this.user = user;
    },
    methods: {
        async onExportData(item){
            const prompt = await this.$_alert.confirm('Melakukan Export Data Barcode Lahan?', 'Harap Cek Data Dengan Teliti!, Proses Export Akan Masu Ke Dalam Hitungan Jumlah Export!', 'Ya, Export!', 'Batal', true)
            if (prompt.isConfirmed) {
                const result = await this.$_api.get('lahan/generate-barcode/detail', {id: item.id})
                var list_lahan_no = result.lahan_numbers
                if(list_lahan_no.length == 0) throw this.$_alert.error('Tidak Ada Data Barcode Lahan!')
                const exportEndpoint = `${this.$_config.baseUrlExport}export/lahan-barcode/excel`
                const exportPayload = {
                    data: list_lahan_no
                }
                const exportFilename = `Export-Generate-Barcode-Lahan-${item.start_lahan_no}-${item.end_lahan_no}-${moment().format('DD-MM-YYYY-HH:mm:ss')}.xlsx`
                
                const axiosConfig = {
                    method: "POST",
                    url: exportEndpoint,
                    responseType: "arraybuffer",
                    data: exportPayload,
                    headers: {
                        "content-type": "application/json",
                        Authorization: `Bearer ${this.$store.state.token}`,
                    },
                };
                const exported = await axios(axiosConfig)
                    .then((res) => {
                        return res;
                    })
                    .catch((err) => {
                        return false;
                    });
                const url = URL.createObjectURL(new Blob([exported.data]));
                const link = document.createElement("a");
                link.href = url;

                const filename = exportFilename;
                link.setAttribute("download", filename);
                document.body.appendChild(link);
                link.click();
                this.$_alert.success('Berhasil Melakukan Export Data Barcode Lahan, Harap Gunakan Semua Nomor yang Disediakan!')
            }
        },
        async onGenerateBarcodeData(){
            this.generateKey += 1
            console.log('test generate')
        }
    },
};
</script>