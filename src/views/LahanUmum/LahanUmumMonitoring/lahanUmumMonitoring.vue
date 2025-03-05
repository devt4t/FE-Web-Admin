<template>

    <geko-base-crud :config="config" :refreshKey="refreshKey" :hideUpdate="true" :hideCreate="true">
        <template v-slot:create-form>
            <lahan-umum-monitoring-create :user="user"></lahan-umum-monitoring-create>
        </template>
        <template v-slot:detail-slave-raw="{ data }">
            <lahan-umum-monitoring-detail :data="data"></lahan-umum-monitoring-detail>
        </template>
    </geko-base-crud>

</template>

<script>
import maintenanceAnimation from "@/assets/lottie/maintenance.json";
import LottieAnimation from "lottie-web-vue";
import LahanUmumMonitoringConfig from "./lahanUmumMonitoringConfig";
import LahanUmumMonitoringCreate from "./lahanUmumMonitoringCreate.vue";
import LahanUmumMonitoringDetail from "./lahanUmumMonitoringDetail.vue";

export default {
    components: {
        LottieAnimation,
        LahanUmumMonitoringCreate,
        LahanUmumMonitoringDetail,
    },
    name: "crud-general-land-monitoring",
    watch: {},
    data() {
        return {
            user: {},
            refreshKey: 1,
            config: {
                export: true,
                title: "Realisasi Tanam - Lahan Umum",
                getter: "general-land/first-monitoring/list",
                getterDataKey: "result",
                totalDataKey: 'total',
                detail: "general-land/first-monitriong/detail",
                detailIdKey: "monitoring_no",
                detailKey: "data",
                // delete: "lahan-umum/main/delete",
                // deleteKey: "lahan_no",
                pk_field: null,
                globalFilter: {
                    program_year: {
                        setter: "program_year",
                    },
                },
                permission: {
                    create: "lahan-umum-create",
                    read: "lahan-umum-list",
                    update: "lahan-umum-update",
                    detail: "lahan-umum-detail",
                    lookup: "lahan-umum-lookup",
                    delete: "lahan-umum-delete",
                },
                slave: [],
                fields: LahanUmumMonitoringConfig,
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
        async onVerif(item){
            const prompt = await this.$_alert.confirm('Verifikasi Data Lahan Umum?', 'Apakah anda yakin akan Verifikasi Data Lahan Umum ini?', 'Ya, Verifikasi', 'Batal', true)
            if (prompt.isConfirmed) {
                this.$_api.post('VerificationLahanUmum', {
                lahan_no: item.lahan_no,
                verified_by: this.user.email,
                })
                .then(() => {
                    this.$_alert.success('Berhasil Melakukan Verifikasi Lahan Umum, Silahkan Lanjutkan Ke Proses Penilikan Lubang')
                    this.refreshKey += 1
                })

            }
        },
        async onUnverif(item){
            // let payload = {
            //     "lahan_no": item.lahan_no
            // }
            // console.log(payload);
            const prompt = await this.$_alert.confirm('Unverifikasi Data Lahan Umum?', 'Apakah anda yakin akan Unverifikasi Data Lahan Umum ini?', 'Ya, Unverifikasi', 'Batal', true)
            if (prompt.isConfirmed) {
                this.$_api.post('general-land/main/unverification', {
                lahan_no: item.lahan_no,
                verified_by: this.user.email,
                })
                .then(() => {
                    this.$_alert.success('Berhasil Melakukan Unverifikasi Lahan Umum')
                    this.refreshKey += 1
                })

            }
        }
    },
};
</script>