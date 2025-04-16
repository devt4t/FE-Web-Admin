<template>
    <geko-base-crud :config="config" :refreshKey="refreshKey" :hideUpdate="true" :hideDelete="true" :hideCreate="true">
        <template v-slot:detail-slave-raw="{ data }">
            <monitoring2-detail-map :long="data.result.longitude" :lat="data.result.latitude" :section="`Monitoring2`" :title="'Koordinat Monitoring'"/>
            <monitoring2-detail :data="data"></monitoring2-detail>
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
                @click="onUnverif(item)" v-if="item.is_verified != 0">
                <v-icon small>mdi-backspace</v-icon>
                <span>Unverifikasi</span>
            </v-btn>
            <v-btn variant="danger" small class="d-flex flex-row align-items-center mt-2"
                @click="onDelete(item)" v-if="item.is_verified == 0">
                <v-icon small>mdi-trash-can</v-icon>
                <span>Hapus Data</span>
            </v-btn>
            <v-btn variant="success" small class="d-flex flex-row align-items-center mt-2"
                @click="onGeneratePopulate(item)" v-if="item.is_verified != 0 && item.is_populated == 0">
                <v-icon small>mdi-inbox-arrow-up</v-icon>
                <span>Populasi Data ke Monitoring 3</span>
            </v-btn>
        </template>
        <template v-slot:list-after-filter>
            <monitoring2-export-selection :data="detailData" :dataKey="detailDataKey"></monitoring2-export-selection>
        </template>
    </geko-base-crud>

</template>

<script>
import maintenanceAnimation from "@/assets/lottie/maintenance.json";
import LottieAnimation from "lottie-web-vue";
import monitoring2DetailMap from "@/views/Lahan/components/DetailLahanMap";
import monitoring2Config from "./monitoring2Component/monitoring2Config";
import monitoring2Detail from "./monitoring2Detail.vue";
import monitoring2ExportSelection from "./monitoring2Component/monitoring2ExportSelection.vue";

import moment from "moment";
import axios from "axios";
export default {
    components: {
        LottieAnimation,
        monitoring2DetailMap,
        monitoring2Detail,
        monitoring2ExportSelection
    },
    name: "crud-monitoring2",
    watch: {},
    data() {
        return {
            user: {},
            refreshKey: 1,
            config: monitoring2Config,
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
                var payload = {
                    currents_monitoring_no: item.monitoring2_no,
                    verified_by: this.user.name
                }
                // console.log(item)
                this.$_api.post('ValidateMonitoring2New', payload)
                .then(() => {
                  this.$_alert.success('Berhasil Melakukan Verifikasi Data Fase Field Coordinator!')
                  this.refreshKey += 1;
                })
            }
        },
        async onVerifUM(item){
            const prompt = await this.$_alert.confirm('Verifikasi Data Fase Unit Manager?', 'Harap Cek Data Dengan Teliti Sebelum Melakukan Verifikasi!', 'Ya, Verifikasi!', 'Batal', true)
            if (prompt.isConfirmed) {
                // console.log(item)
                var payload = {
                    currents_monitoring_no: item.monitoring2_no,
                    verified_by: this.user.name
                }
                this.$_api.post('UMValidateMonitoring2', payload)
                .then(() => {
                  this.$_alert.success('Berhasil Melakukan Verifikasi Data Fase Unit Manager!')
                  this.refreshKey += 1;
                })
            }
        },
        async onUnverif(item){
            const prompt = await this.$_alert.confirm('Unverifikasi Data Monitoring?', 'Harap Cek Data Dengan Teliti!, Proses Unverifikasi Akan Mengembalikan Status Data ke "Belum Terverifikasi!"', 'Ya, Unverifikasi!', 'Batal', true)
            if (prompt.isConfirmed) {
                this.$_api.post('monitoring2/main/unverification', {monitoring_no: item.monitoring2_no})
                .then(() => {
                  this.$_alert.success('Berhasil Melakukan Unverifikasi Data Monitoring!')
                  this.refreshKey += 1;
                })
            }
        },
        async onDelete(item){
            const prompt = await this.$_alert.confirm('Hapus Data Monitoring?', 'Harap Cek Data Dengan Teliti!, Proses Hapus Tidak Dapat Dikembalikan!"', 'Ya, Hapus!', 'Batal', true)
            if (prompt.isConfirmed) {
                // console.log(item);
                this.$_api.post('monitoring2/main/delete', {monitoring2_no: item.monitoring2_no, is_verified: item.is_verified, populate_no: item.populate_no})
                .then(() => {
                  this.$_alert.success('Berhasil Melakukan Hapus Data Monitoring!')
                  this.refreshKey += 1;
                })
            }
        },
        async onGeneratePopulate(item){
            const prompt = await this.$_alert.confirm('Generate Data Populasi Ke Monitoring 3?', 'Harap Cek Data Dengan Teliti Sebelum Melakukan Generate Data!', 'Ya, Generate!', 'Batal', true)
            if (prompt.isConfirmed) {
                // console.log(item)
                this.$_api.post('populate-monitoring/2-to-3/create', item)
                .then(() => {
                  this.$_alert.success('Berhasil Melakukan Generate Data Ke Populasi Monitoring 3!, Silahkan Melanjutkan Proses Monitoring 3.')
                  this.refreshKey += 1;
                })
            }
        }
    },
};
</script>