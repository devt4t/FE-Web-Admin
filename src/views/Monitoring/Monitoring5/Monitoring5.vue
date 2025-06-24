<template>
    <geko-base-crud :config="config" :refreshKey="refreshKey" :hideUpdate="true" :hideDelete="true" :hideCreate="true">
        <template v-slot:detail-slave-raw="{ data }">
            <monitoring5-detail-map :long="data.result.longitude" :lat="data.result.latitude" :section="`monitoring5`" :title="'Koordinat Monitoring'"/>
            <monitoring5-detail :data="data"></monitoring5-detail>
        </template>
        <template v-slot:list-indicator="{ item }">
            <div class="indicator-wrapper pt-1">
                <div class="indicator" :class="{
                    danger: item.is_verified == 0,
                    warning: item.is_verified == 1,
                    success: item.is_verified == 2,
                }"></div>
            </div>
        </template>

        <template v-slot:list-bottom-action="{ item }">
            <v-btn variant="primary" small class="d-flex flex-row align-items-center mt-2"
                @click="onExportDetailSelection(item)" v-if="$_sys.isAllowed('field-facilitator-update')">
                <v-icon small>mdi-download</v-icon>
                <span>Export Detail</span>
            </v-btn>
            <v-btn variant="warning" small class="d-flex flex-row align-items-center mt-2"
                @click="onVerifFC(item)" v-if="item.is_verified == 0">
                <v-icon small>mdi-check</v-icon>
                <span>Verifikasi FC</span>
            </v-btn>
            <v-btn variant="success" small class="d-flex flex-row align-items-center mt-2"
                @click="onVerifUM(item)" v-if="item.is_verified == 1">
                <v-icon small>mdi-check-all</v-icon>
                <span>Verifikasi UM</span>
            </v-btn>
            <v-btn variant="info" small class="d-flex flex-row align-items-center mt-2"
                @click="onPrintLable(item)" v-if="item.sampling == 'Tetap'">
                <v-icon small>mdi-printer</v-icon>
                <span>Cetak Lable Pohon Monitoring</span>
            </v-btn>
            <v-btn variant="danger" small class="d-flex flex-row align-items-center mt-2"
                @click="onDelete(item)" v-if="item.is_verified == 0">
                <v-icon small>mdi-trash-can</v-icon>
                <span>Hapus</span>
            </v-btn>
            <v-btn variant="danger" small class="d-flex flex-row align-items-center mt-2"
                @click="onUnverif(item)" v-if="item.is_verified != 0">
                <v-icon small>mdi-backspace</v-icon>
                <span>Unverifikasi</span>
            </v-btn>
            <!-- <v-btn variant="success" small class="d-flex flex-row align-items-center mt-2"
                @click="onGeneratePopulate(item)" v-if="item.is_verified == 2">
                <v-icon small>mdi-check-bold</v-icon>
                <span>Generate Data Populate Monitoring 5</span>
            </v-btn> -->
        </template>
        <template v-slot:list-before-create>
            <monitoring5-export-selection :data="detailData" :dataKey="detailDataKey" @success="refreshKey = refreshKey + 1"></monitoring5-export-selection>
            <monitoring5-print-lable :data="lableData" :dataKey="lableDataKey" @success="refreshKey = refreshKey + 1"></monitoring5-print-lable>
            <monitoring5-export :dataKey="exportKey" />
        </template>
        <template v-slot:list-after-filter>
            <div class="d-flex flex-row justify-content-start">
                <v-btn variant="info" class="mr-2" @click="exportKey += 1">
                    <v-icon>mdi-table-arrow-right</v-icon>
                    <span>Export Excel </span>
                </v-btn>
            </div>
            
        </template>
    </geko-base-crud>

</template>

<script>
import maintenanceAnimation from "@/assets/lottie/maintenance.json";
import LottieAnimation from "lottie-web-vue";
import monitoring5DetailMap from "@/views/Lahan/components/DetailLahanMap";
import monitoring5Config from "./monitoring5Component/monitoring5Config";
import monitoring5Detail from "./monitoring5Detail.vue";
import monitoring5ExportSelection from "./monitoring5Component/monitoring5ExportSelection.vue";
import monitoring5PrintLable from "./monitoring5Component/monitoring5PrintLable.vue";
import monitoring5Export from "./monitoring5Component/monitoring5ExportModal.vue";

import moment from "moment";
import axios from "axios";
export default {
    components: {
        LottieAnimation,
        monitoring5DetailMap,
        monitoring5Detail,
        monitoring5ExportSelection,
        monitoring5PrintLable,
        monitoring5Export,
    },
    name: "crud-monitoring5",
    watch: {},
    data() {
        return {
            user: {},
            refreshKey: 1,
            config: monitoring5Config,
            lottie: maintenanceAnimation,
            detailDataKey: 0,
            detailData: [],
            lableDataKey: 0,
            lableData: [],
            exportKey: 0,
        };
    },
    mounted() {
        const user = JSON.parse(localStorage.getItem("User"));
        this.user = user;
    },
    methods: {
        onExportDetailSelection(item){
            this.detailData = item
            this.detailDataKey += 1
        },
        async onPrintLable(item){
            this.lableData = item
            this.lableDataKey += 1
        },
        async onVerifFC(item){
            const prompt = await this.$_alert.confirm('Verifikasi Data Fase Field Coordinator?', 'Harap Cek Data Dengan Teliti Sebelum Melakukan Verifikasi!', 'Ya, Verifikasi!', 'Batal', true)
            if (prompt.isConfirmed) {
                this.$_api.post('fifth-monitorings/main/verification-fc', {monitoring5_no: item.monitoring5_no})
                .then(() => {
                  this.$_alert.success('Berhasil Melakukan Verifikasi Data Fase Field Coordinator!')
                  this.refreshKey += 1;
                })
            }
        },
        async onVerifUM(item){
            const prompt = await this.$_alert.confirm('Verifikasi Data Fase Unit Manager?', 'Harap Cek Data Dengan Teliti Sebelum Melakukan Verifikasi!', 'Ya, Verifikasi!', 'Batal', true)
            if (prompt.isConfirmed) {
                this.$_api.post('fifth-monitorings/main/verification-um', {monitoring5_no: item.monitoring5_no})
                .then(() => {
                  this.$_alert.success('Berhasil Melakukan Verifikasi Data Fase Unit Manager!')
                  this.refreshKey += 1;
                })
            }
        },
        async onUnverif(item){
            const prompt = await this.$_alert.confirm('Unverifikasi Data Monitoring?', 'Harap Cek Data Dengan Teliti!, Proses Unverifikasi Akan Mengembalikan Status Data ke "Belum Terverifikasi!"', 'Ya, Unverifikasi!', 'Batal', true)
            if (prompt.isConfirmed) {
                this.$_api.post('fifth-monitorings/main/unverification', {monitoring5_no: item.monitoring5_no})
                .then(() => {
                  this.$_alert.success('Berhasil Melakukan Unverifikasi Data Monitoring!')
                  this.refreshKey += 1;
                })
            }
        },
        async onDelete(item){
            const prompt = await this.$_alert.confirm('Hapus Data Monitoring?', 'Harap Cek Data Dengan Teliti Sebelum Menghapus!','Ya, Hapus!', 'Batal', true)
            if (prompt.isConfirmed) {
                console.log(item)
                this.$_api.post('fifth-monitorings/main/delete', {monitoring5_no: item.monitoring5_no, populate3_no: item.populate3_no})
                .then(() => {
                  this.$_alert.success('Berhasil Melakukan Hapus Data monitoring5!')
                  this.refreshKey += 1;
                })
            }
        },
        // async onGeneratePopulate(item){
        //     const prompt = await this.$_alert.confirm('Generate Data Untuk Populasi Monitoring 5?', 'Harap Cek Data Dengan Teliti!', true)
        //     if (prompt.isConfirmed) {
        //         // console.log(item);
        //         this.$_api.post('populate-monitoring/4-to-5/create', item)
        //         .then(() => {
        //           this.$_alert.success('Berhasil Melakukan Generate Data Ke Populasi Monitoring 5!, Silahkan Melanjutkan Proses Monitoring 5.')
        //           this.refreshKey += 1;
        //         })
        //     }
        // }
    },
};
</script>