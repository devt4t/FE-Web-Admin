<template>
    <geko-base-crud :config="config" :refreshKey="refreshKey" :hideUpdate="true" :hideDelete="true" :hideCreate="true">
        <template v-slot:detail-slave-raw="{ data }">
            <monitoring4-detail-map :long="data.result.longitude" :lat="data.result.latitude" :section="`Monitoring4`" :title="'Koordinat Monitoring'"/>
            <monitoring4-detail :data="data"></monitoring4-detail>
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
                <span>Generate Data Populate Monitoring 4</span>
            </v-btn> -->
        </template>
        <template v-slot:list-before-create>
            <monitoring4-export-selection :data="detailData" :dataKey="detailDataKey" @success="refreshKey = refreshKey + 1"></monitoring4-export-selection>
            <monitoring4-print-lable :data="lableData" :dataKey="lableDataKey" @success="refreshKey = refreshKey + 1"></monitoring4-print-lable>
            <monitoring4-export :dataKey="exportKey" />
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
import monitoring4DetailMap from "@/views/Lahan/components/DetailLahanMap";
import monitoring4Config from "./monitoring4Component/monitoring4Config";
import monitoring4Detail from "./monitoring4Detail.vue";
import monitoring4ExportSelection from "./monitoring4Component/monitoring4ExportSelection.vue";
import monitoring4PrintLable from "./monitoring4Component/monitoring4PrintLable.vue";
import Monitoring4Export from "./monitoring4Component/monitoring4ExportModal.vue";

import moment from "moment";
import axios from "axios";
export default {
    components: {
        LottieAnimation,
        monitoring4DetailMap,
        monitoring4Detail,
        monitoring4ExportSelection,
        monitoring4PrintLable,
        Monitoring4Export,
    },
    name: "crud-monitoring4",
    watch: {},
    data() {
        return {
            user: {},
            refreshKey: 1,
            config: monitoring4Config,
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
                this.$_api.post('fourth-monitorings/main/verification-fc', {monitoring4_no: item.monitoring4_no})
                .then(() => {
                  this.$_alert.success('Berhasil Melakukan Verifikasi Data Fase Field Coordinator!')
                  this.refreshKey += 1;
                })
            }
        },
        async onVerifUM(item){
            const prompt = await this.$_alert.confirm('Verifikasi Data Fase Unit Manager?', 'Harap Cek Data Dengan Teliti Sebelum Melakukan Verifikasi!', 'Ya, Verifikasi!', 'Batal', true)
            if (prompt.isConfirmed) {
                this.$_api.post('fourth-monitorings/main/verification-um', {monitoring4_no: item.monitoring4_no})
                .then(() => {
                  this.$_alert.success('Berhasil Melakukan Verifikasi Data Fase Unit Manager!')
                  this.refreshKey += 1;
                })
            }
        },
        async onUnverif(item){
            const prompt = await this.$_alert.confirm('Unverifikasi Data Monitoring?', 'Harap Cek Data Dengan Teliti!, Proses Unverifikasi Akan Mengembalikan Status Data ke "Belum Terverifikasi!"', 'Ya, Unverifikasi!', 'Batal', true)
            if (prompt.isConfirmed) {
                this.$_api.post('fourth-monitorings/main/unverification', {monitoring4_no: item.monitoring4_no})
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
                this.$_api.post('fourth-monitorings/main/delete', {monitoring4_no: item.monitoring4_no, populate3_no: item.populate3_no})
                .then(() => {
                  this.$_alert.success('Berhasil Melakukan Hapus Data Monitoring4!')
                  this.refreshKey += 1;
                })
            }
        },
        // async onGeneratePopulate(item){
        //     const prompt = await this.$_alert.confirm('Generate Data Untuk Populasi Monitoring 4?', 'Harap Cek Data Dengan Teliti!', true)
        //     if (prompt.isConfirmed) {
        //         // console.log(item);
        //         this.$_api.post('populate-monitoring/4-to-5/create', item)
        //         .then(() => {
        //           this.$_alert.success('Berhasil Melakukan Generate Data Ke Populasi Monitoring 4!, Silahkan Melanjutkan Proses Monitoring 4.')
        //           this.refreshKey += 1;
        //         })
        //     }
        // }
    },
};
</script>