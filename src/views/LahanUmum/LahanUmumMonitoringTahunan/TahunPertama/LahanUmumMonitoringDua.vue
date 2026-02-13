<template>
    <geko-base-crud :config="config" :refreshKey="refreshKey" :hideUpdate="true" :hideCreate="true">
        <template v-slot:create-form>
            <lahan-umum-monitoring-create :user="user"></lahan-umum-monitoring-create>
        </template>
        <template v-slot:detail-slave-raw="{ data }">
            <lahan-umum-monitoring-detail :data="data"></lahan-umum-monitoring-detail>
        </template>
        <template v-slot:list-indicator="{ item }">
            <div class="indicator-wrapper pt-1">
                <div class="indicator" :class="{ danger: item.is_verified == 0, success: item.is_verified == 1 }"></div>
            </div>
        </template>
        <template v-slot:list-bottom-action="{ item }">
            <v-btn v-if="item.is_verified == 1 && $_sys.isAllowed('lahan-umum-unverification-update')" variant="danger"
                small class="mt-2" @click="onUnverif(item)">
                <v-icon left small>mdi-undo</v-icon>
                <span>Unverifikasi</span>
            </v-btn>
            <v-btn v-else-if="item.is_verified == 0 && $_sys.isAllowed('lahan-umum-verification-update')"
                variant="success" small class="mt-2" @click="onVerif(item)">
                <v-icon left small>mdi-check-bold</v-icon>
                <span>Verifikasi</span>
            </v-btn>
        </template>
    </geko-base-crud>

</template>

<script>
import maintenanceAnimation from "@/assets/lottie/maintenance.json";
import LottieAnimation from "lottie-web-vue";
import LahanUmumMonitoringTahunanConfig from "./LahanUmumMonitoringDuaConfig";
import LahanUmumMonitoringTahunanDetail from "./LahanUmumMonitoringDuaDetail.vue";

export default {
    components: {
        LottieAnimation,
        LahanUmumMonitoringTahunanDetail,
    },
    name: "crud-general-land-monitoring",
    watch: {},
    data() {
        return {
            user: {},
            refreshKey: 1,
            config: {
                // untuk export di munculkan atau tidak, true = iya false = tidak
                export: false,

                // ini akan muncul di breadcrumb dan juga di bagian header
                title: "Monitoring 2 - Lahan Umum",

                // API Endpoints untuk ambil semua data
                getter: "general-land/first-monitoring/list",
                getterDataKey: "result",
                totalDataKey: 'total',

                // APi Endpoints untuk ambil detail nya
                detail: "general-land/first-monitriong/detail",
                detailIdKey: "monitoring_no",
                detailKey: "data",

                // API Endpoints untuk delete data
                delete: "lahan-umum/main/delete",
                deleteKey: "lahan_no",

                pk_field: null,

                // Filter global
                globalFilter: {
                    program_year: {
                        setter: "program_year",
                    },
                },

                // Permission wajib (karena inii yang muncul di sidebar)
                permission: {
                    create: "lahan-umum-create",
                    read: "lahan-umum-list",
                    update: "lahan-umum-update",
                    detail: "lahan-umum-detail",
                    lookup: "lahan-umum-lookup",
                    delete: "lahan-umum-delete",
                },
                slave: [],

                // Fields config yang akan memuncul kan di tabel header
                fields: LahanUmumMonitoringTahunanConfig,
            },
            lottie: maintenanceAnimation,
            exportModal: 0,
            exportFormat: null
        };
    },
    mounted() {
        const user = JSON.parse(localStorage.getItem("User"));
        this.user = user;
    },
    methods: {
        async onVerif(item) {
            const prompt = await this.$_alert.confirm('Verifikasi Data Monitoring Lahan Umum?', 'Apakah anda yakin akan Verifikasi Data Monitoring Lahan Umum ini?', 'Ya, Verifikasi', 'Batal', true)
            if (prompt.isConfirmed) {
                this.$_api.post('ValidateMonitoringLahanUmum', {
                    monitoring_no: item.monitoring_no,
                    validate_by: this.user.email,
                })
                    .then(() => {
                        this.$_alert.success('Berhasil Melakukan Verifikasi Monitoring Lahan Umum')
                        this.refreshKey += 1
                    })

            }
        },
        async onUnverif(item) {
            // let payload = {
            //     "lahan_no": item.lahan_no
            // }
            // console.log(payload);
            const prompt = await this.$_alert.confirm('Unverifikasi Data Monitoring Lahan Umum?', 'Apakah anda yakin akan Unverifikasi Data Monitoring Lahan Umum ini?', 'Ya, Unverifikasi', 'Batal', true)
            if (prompt.isConfirmed) {
                this.$_api.post('UnverificationMonitoringLahanUmum', {
                    monitoring_no: item.monitoring_no,
                    // verified_by: this.user.email,
                })
                    .then(() => {
                        this.$_alert.success('Berhasil Melakukan Unverifikasi Monitoring Lahan Umum')
                        this.refreshKey += 1
                    })

            }
        }
    },
};
</script>