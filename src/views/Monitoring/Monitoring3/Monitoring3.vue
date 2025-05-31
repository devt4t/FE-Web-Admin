<template>
    <geko-base-crud :config="config" :refreshKey="refreshKey" :hideUpdate="true" :hideDelete="true" :hideCreate="true">
        <template v-slot:detail-slave-raw="{ data }">
            <monitoring3-detail-map :long="data.result.longitude" :lat="data.result.latitude" :section="`Monitoring3`" :title="'Koordinat Monitoring'"/>
            <monitoring3-detail :data="data"></monitoring3-detail>
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
                @click="onExportDetailSelectiom(item)" v-if="$_sys.isAllowed('field-facilitator-update')">
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
            <v-btn variant="success" small class="d-flex flex-row align-items-center mt-2"
                @click="onGeneratePopulate(item)" v-if="item.is_verified == 2">
                <v-icon small>mdi-check-bold</v-icon>
                <span>Generate Data Populate Monitoring 4</span>
            </v-btn>
        </template>
        <template v-slot:list-after-filter>
            <monitoring3-export-selection :data="detailData" :dataKey="detailDataKey" @success="refreshKey = refreshKey + 1"></monitoring3-export-selection>
        </template>
    </geko-base-crud>

</template>

<script>
import maintenanceAnimation from "@/assets/lottie/maintenance.json";
import LottieAnimation from "lottie-web-vue";
import monitoring3DetailMap from "@/views/Lahan/components/DetailLahanMap";
import monitoring3Config from "./monitoring3Component/monitoring3Config";
import monitoring3Detail from "./monitoring3Detail.vue";
import monitoring3ExportSelection from "./monitoring3Component/monitoring3ExportSelection.vue";

import moment from "moment";
import axios from "axios";
export default {
    components: {
        LottieAnimation,
        monitoring3DetailMap,
        monitoring3Detail,
        monitoring3ExportSelection
    },
    name: "crud-monitoring3",
    watch: {},
    data() {
        return {
            user: {},
            refreshKey: 1,
            config: monitoring3Config,
            lottie: maintenanceAnimation,
            detailDataKey: 0,
            detailData: [],
        };
    },
    mounted() {
        const user = JSON.parse(localStorage.getItem("User"));
        this.user = user;
    },
    methods: {
        onExportDetailSelectiom(item){
            this.detailData = item
            this.detailDataKey += 1
        },
        async onVerifFC(item){
            const prompt = await this.$_alert.confirm('Verifikasi Data Fase Field Coordinator?', 'Harap Cek Data Dengan Teliti Sebelum Melakukan Verifikasi!', 'Ya, Verifikasi!', 'Batal', true)
            if (prompt.isConfirmed) {
                this.$_api.post('monitoring3/main/verification-fc', {monitoring3_no: item.monitoring3_no})
                .then(() => {
                  this.$_alert.success('Berhasil Melakukan Verifikasi Data Fase Field Coordinator!')
                  this.refreshKey += 1;
                })
            }
        },
        async onVerifUM(item){
            const prompt = await this.$_alert.confirm('Verifikasi Data Fase Unit Manager?', 'Harap Cek Data Dengan Teliti Sebelum Melakukan Verifikasi!', 'Ya, Verifikasi!', 'Batal', true)
            if (prompt.isConfirmed) {
                this.$_api.post('monitoring3/main/verification-um', {monitoring3_no: item.monitoring3_no})
                .then(() => {
                  this.$_alert.success('Berhasil Melakukan Verifikasi Data Fase Unit Manager!')
                  this.refreshKey += 1;
                })
            }
        },
        async onUnverif(item){
            const prompt = await this.$_alert.confirm('Unverifikasi Data Monitoring?', 'Harap Cek Data Dengan Teliti!, Proses Unverifikasi Akan Mengembalikan Status Data ke "Belum Terverifikasi!"', 'Ya, Unverifikasi!', 'Batal', true)
            if (prompt.isConfirmed) {
                this.$_api.post('monitoring3/main/unverification', {monitoring3_no: item.monitoring3_no})
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
                this.$_api.post('monitoring3/main/delete', {monitoring3_no: item.monitoring3_no, populate2_no: item.populate2_no})
                .then(() => {
                  this.$_alert.success('Berhasil Melakukan Hapus Data Monitoring3!')
                  this.refreshKey += 1;
                })
            }
        },
        async onGeneratePopulate(item){
            const prompt = await this.$_alert.confirm('Generate Data Untuk Populasi Monitoring 4?', 'Harap Cek Data Dengan Teliti!', true)
            if (prompt.isConfirmed) {
                console.log(item);
            }
        }
    },
};
</script>