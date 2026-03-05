<template>

    <geko-base-crud :config="config" :refreshKey="refreshKey" :hideUpdate="true" :hideCreate="false"
        :hideDelete="false">
        <template v-slot:create-form>
            <lahan-umum-monitoring-create :user="user"></lahan-umum-monitoring-create>
        </template>
        <template v-slot:detail-slave-raw="{ data }">
            <lahan-umum-monitoring-detail :data="data"></lahan-umum-monitoring-detail>
        </template>
        <template v-slot:list-indicator="{ item }">
            <div class="indicator-wrapper pt-1">
                <div class="indicator" :class="{
                    danger: item.is_verified == 0,
                    warning: item.is_verified == 1,
                    info: item.is_verified == 2 && item.is_populated == 0,
                    success: item.is_verified == 2 && item.is_populated == 1
                }"></div>
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
            <v-btn variant="success" small class="d-flex flex-row align-items-center mt-2"
                @click="onGeneratePopulate(item)" v-if="item.is_verified != 0 && item.is_populated == 0">
                <v-icon left small>mdi-inbox-arrow-up</v-icon>
                <span>Populasi Data ke Monitoring 2</span>
            </v-btn>
        </template>
        <template v-slot:list-action-extra="{ item }">
            <button v-if="item.is_verified == 0 && $_sys.isAllowed('lahan-umum-delete')" variant="danger" small
                @click="onDelete(item)" title="Hapus Data" class="geko-list-action-delete">
                <v-icon small>mdi-delete</v-icon>
            </button>
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
                // delete: "DeleteMonitoringLahanUmum",
                // deleteKey: "monitoring_no",
                // deleteLabel: "monitoring_no",
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
        /**
         * todo: editanku => untuk menuju ke populate 
         * @param item 
         */
        // ==start==
        async onGeneratePopulate(item) {
            const prompt = await this.$_alert.confirm('Generate Data Populasi Ke Monitoring 2?', 'Harap Cek Data Dengan Teliti Sebelum Melakukan Generate Data!', 'Ya, Generate!', 'Batal', true)
            if (prompt.isConfirmed) {
                const payload = {
                    list_monitoring1: [item]
                };
                this.$_api.post('general-land/populate-monitoring/1-to-2/create', payload)
                    .then(() => {
                        this.$_alert.success('Berhasil Melakukan Generate Data Ke Populasi Monitoring 2!, Silahkan Melanjutkan Proses Monitoring 2.')
                        this.refreshKey += 1;
                    })
                    .catch((error) => {
                        console.error('Error generating populate:', error);
                        this.$_alert.error('Gagal melakukan generate data populasi!');
                    });
            }
        },
        // ==end==

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
        },
        // // editanku => untuk delete monitoring
        async onDelete(item) {
            const prompt = await this.$_alert.confirm('Hapus Data Monitoring Lahan Umum?', 'Data yang dihapus tidak dapat dikembalikan. Apakah anda yakin?', 'Ya, Hapus', 'Batal', true);
            if (prompt.isConfirmed) {
                this.$_api.post('DeleteMonitoringLahanUmum', {
                    monitoring_no: item.monitoring_no,
                })
                    .then(() => {
                        this.$_alert.success('Berhasil Hapus Data Monitoring Lahan Umum')
                        this.refreshKey += 1
                    })
                    .catch((error) => {
                        console.error('Error deleting monitoring:', error)
                        this.$_alert.error('Gagal Hapus Data Monitoring Lahan Umum')
                    })
            }
        }
    },
};
</script>