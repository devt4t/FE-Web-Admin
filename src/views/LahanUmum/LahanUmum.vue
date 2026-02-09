<template>

    <geko-base-crud :config="config" :refreshKey="refreshKey" @onExportExcel="onExportExcel($event)"
        @onExportPdf="onExportPdf($event)">
        <template v-slot:list-before-create>
            <lahan-export-modal :dataKey="exportModal" :format="exportFormat" />
        </template>
<template v-slot:list-scooping_visits_data_no="{ item }">
            <span v-if="!item.scooping_visits_data_no" class="badge bg-danger min-w-10px d-flex">
                <v-icon size="small">mdi-close-circle</v-icon> &nbsp; <strong>Desa Diluar Program</strong>
            </span>
            <span v-else class="badge bg-success min-w-10px d-flex">
                <v-icon size="small">mdi-check-bold</v-icon> &nbsp; <strong>Desa Program</strong>
            </span>
        </template>
<template v-slot:detail-scooping_visits_data_no="{ item }">
            <span v-if="!item.scooping_visits_data_no" class="badge bg-danger">
                <v-icon size="small">mdi-close-circle</v-icon> &nbsp; <strong>Desa Diluar Program</strong>
            </span>
            <span v-else class="badge bg-success">
                <v-icon size="small">mdi-check-bold</v-icon> &nbsp; <strong>Desa Program</strong>
            </span>
        </template>
<template v-slot:list-total_holes="{ item }">
            <span v-if="item.total_holes == 0" class="badge bg-danger min-w-10px d-flex">
                <v-icon size="small">mdi-close-circle</v-icon> &nbsp; <strong>Belum Terdaftar</strong>
            </span>
            <span v-else class="badge bg-success min-w-10px d-flex">
                <v-icon size="small">mdi-check-bold</v-icon> &nbsp; <strong>Terdaftar</strong>
            </span>
        </template>
<template v-slot:detail-total_holes="{ item }">
            <span v-if="item.total_holes == 0" class="badge bg-danger">
                <v-icon size="small">mdi-close-circle</v-icon> &nbsp; <strong>Belum Terdaftar</strong>
            </span>
            <span v-else class="badge bg-success">
                <v-icon size="small">mdi-check-bold</v-icon> &nbsp; <strong>Terdaftar</strong>
            </span>
        </template>
<template v-if="$_sys.isAllowed('pelatihan-petani-export-create')" v-slot:list-bottom-action="{ item }">
            <!-- di comment karena jika sudah di verif tidak bisa di unverif tapi jangan dihapus dulu -->
            <!-- <v-btn v-if="item.is_verified == 1 && $_sys.isAllowed('lahan-umum-update')" variant="danger" small
                class="mt-2" @click="onUnverif(item)">
                <v-icon left small>mdi-undo</v-icon>
                <span>Unverifikasi</span>
            </v-btn> -->

            <v-btn v-if="item.is_verified == 0 && $_sys.isAllowed('lahan-umum-update')" variant="success" small
                class="mt-2" @click="onVerif(item)">
                <v-icon left small>mdi-check-bold</v-icon>
                <span>Verifikasi</span>
            </v-btn>
        </template>

<template v-slot:detail-slave-raw="{ data }">
            <lahan-umum-detail-map :long="data.result.longitude" :lat="data.result.latitude" :section="`LahanUmum`" />
            <lahan-umum-detail :data="data"></lahan-umum-detail>
        </template>
<template v-slot:create-form>
            <lahan-umum-create :user="user" :type="formType"></lahan-umum-create>
        </template>
</geko-base-crud>

</template>

<script>
import maintenanceAnimation from "@/assets/lottie/maintenance.json";
import LottieAnimation from "lottie-web-vue";
import LahanUmumConfig from "./LahanUmumConfig";
import LahanUmumDetail from "./LahanUmumDetail.vue";
import LahanUmumDetailMap from "@/views/Lahan/components/DetailLahanMap";
import LahanUmumCreate from "./lahanUmumCreate.vue"
import LahanUmumUpdate from "./lahanUmumUpdate.vue";
import LahanExportModal from "./LahanExportModal.vue";

export default {
    components: {
        LottieAnimation,
        LahanUmumDetail,
        LahanUmumDetailMap,
        LahanUmumCreate,
        LahanUmumUpdate,
        LahanExportModal
    },
    name: "crud-public-land",
    watch: {},
    data() {
        return {
            formType: 'create',
            user: {},
            refreshKey: 1,
            config: {
                /**
                 * TODO: edit => untuk disable button verifikasi, edit, dan delete jika sudah di verifikasi
                 */
                updateValidationKey: 'is_verified',
                deleteValidationKey: 'is_verified',

                // config sebelumnya
                export: true,
                title: "Lahan Umum",
                getter: "lahan-umum/main/list",
                getterDataKey: "result",
                totalDataKey: 'total',
                detail: "lahan-umum/main/detail",
                detailIdKey: "id",
                detailKey: "result",
                delete: "lahan-umum/main/delete",
                deleteKey: "lahan_no",
                setter: "lahan-umum/main/create",
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
                fields: LahanUmumConfig,
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
        onExportExcel() {
            if ([16, 1, 3].includes(this.$store.state.User.role)) {
                this.exportSocialImpactModal += 1;
            } else {
                this.exportModal += 1;
                this.exportFormat = "excel";
            }
        },

        onExportPdf() {
            this.exportModal += 1;
            this.exportFormat = "pdf";
        },
        async onVerif(item) {
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
        /**
         * Ini di comment karena tidak ada fitur unverifikasi
         * jangan dihapus
         */
        // async onUnverif(item) {
        //     // let payload = {
        //     //     "lahan_no": item.lahan_no
        //     // }
        //     // console.log(payload);
        //     const prompt = await this.$_alert.confirm('Unverifikasi Data Lahan Umum?', 'Apakah anda yakin akan Unverifikasi Data Lahan Umum ini?', 'Ya, Unverifikasi', 'Batal', true)
        //     if (prompt.isConfirmed) {
        //         this.$_api.post('general-land/main/unverification', {
        //             lahan_no: item.lahan_no,
        //             verified_by: this.user.email,
        //         })
        //             .then(() => {
        //                 this.$_alert.success('Berhasil Melakukan Unverifikasi Lahan Umum')
        //                 this.refreshKey += 1
        //             })

        //     }
        // }
    },
};
</script><template>

    <geko-base-crud :config="config" :refreshKey="refreshKey" @onExportExcel="onExportExcel($event)"
        @onExportPdf="onExportPdf($event)">
        <template v-slot:list-before-create>
            <lahan-export-modal :dataKey="exportModal" :format="exportFormat" />
        </template>
        <template v-slot:list-scooping_visits_data_no="{ item }">
            <span v-if="!item.scooping_visits_data_no" class="badge bg-danger min-w-10px d-flex">
                <v-icon size="small">mdi-close-circle</v-icon> &nbsp; <strong>Desa Diluar Program</strong>
            </span>
            <span v-else class="badge bg-success min-w-10px d-flex">
                <v-icon size="small">mdi-check-bold</v-icon> &nbsp; <strong>Desa Program</strong>
            </span>
        </template>
        <template v-slot:detail-scooping_visits_data_no="{ item }">
            <span v-if="!item.scooping_visits_data_no" class="badge bg-danger">
                <v-icon size="small">mdi-close-circle</v-icon> &nbsp; <strong>Desa Diluar Program</strong>
            </span>
            <span v-else class="badge bg-success">
                <v-icon size="small">mdi-check-bold</v-icon> &nbsp; <strong>Desa Program</strong>
            </span>
        </template>
        <template v-slot:list-total_holes="{ item }">
            <span v-if="item.total_holes == 0" class="badge bg-danger min-w-10px d-flex">
                <v-icon size="small">mdi-close-circle</v-icon> &nbsp; <strong>Belum Terdaftar</strong>
            </span>
            <span v-else class="badge bg-success min-w-10px d-flex">
                <v-icon size="small">mdi-check-bold</v-icon> &nbsp; <strong>Terdaftar</strong>
            </span>
        </template>
        <template v-slot:detail-total_holes="{ item }">
            <span v-if="item.total_holes == 0" class="badge bg-danger">
                <v-icon size="small">mdi-close-circle</v-icon> &nbsp; <strong>Belum Terdaftar</strong>
            </span>
            <span v-else class="badge bg-success">
                <v-icon size="small">mdi-check-bold</v-icon> &nbsp; <strong>Terdaftar</strong>
            </span>
        </template>
        <template v-if="$_sys.isAllowed('pelatihan-petani-export-create')" v-slot:list-bottom-action="{ item }">
            <!-- di comment karena jika sudah di verif tidak bisa di unverif -->
            <!-- <v-btn v-if="item.is_verified == 1 && $_sys.isAllowed('lahan-umum-update')" variant="danger" small
                class="mt-2" @click="onUnverif(item)">
                <v-icon left small>mdi-undo</v-icon>
                <span>Unverifikasi</span>
            </v-btn> -->
            <v-btn v-if="item.is_verified == 0 && $_sys.isAllowed('lahan-umum-update')" variant="success" small
                class="mt-2" @click="onVerif(item)">
                <v-icon left small>mdi-check-bold</v-icon>
                <span>Verifikasi</span>
            </v-btn>
        </template>

        <template v-slot:detail-slave-raw="{ data }">
            <lahan-umum-detail-map :long="data.result.longitude" :lat="data.result.latitude" :section="`LahanUmum`" />
            <lahan-umum-detail :data="data"></lahan-umum-detail>
        </template>
        <template v-slot:create-form>
            <lahan-umum-create :user="user" :type="formType"></lahan-umum-create>
        </template>
    </geko-base-crud>

</template>

<script>
import maintenanceAnimation from "@/assets/lottie/maintenance.json";
import LottieAnimation from "lottie-web-vue";
import LahanUmumConfig from "./LahanUmumConfig";
import LahanUmumDetail from "./LahanUmumDetail.vue";
import LahanUmumDetailMap from "@/views/Lahan/components/DetailLahanMap";
import LahanUmumCreate from "./lahanUmumCreate.vue"
import LahanUmumUpdate from "./lahanUmumUpdate.vue";
import LahanExportModal from "./LahanExportModal.vue";

export default {
    components: {
        LottieAnimation,
        LahanUmumDetail,
        LahanUmumDetailMap,
        LahanUmumCreate,
        LahanUmumUpdate,
        LahanExportModal
    },
    name: "crud-public-land",
    watch: {},
    data() {
        return {
            formType: 'create',
            user: {},
            refreshKey: 1,
            config: {
                /**
                 * TODO: edit => untuk disable button verifikasi, edit, dan delete jika sudah di verifikasi
                 */
                updateValidationKey: 'is_verified',
                deleteValidationKey: 'is_verified',

                // config sebelumnya
                export: true,
                title: "Lahan Umum",
                getter: "lahan-umum/main/list",
                getterDataKey: "result",
                totalDataKey: 'total',
                detail: "lahan-umum/main/detail",
                detailIdKey: "id",
                detailKey: "result",
                delete: "lahan-umum/main/delete",
                deleteKey: "lahan_no",
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
                fields: LahanUmumConfig,
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
        onExportExcel() {
            if ([16, 1, 3].includes(this.$store.state.User.role)) {
                this.exportSocialImpactModal += 1;
            } else {
                this.exportModal += 1;
                this.exportFormat = "excel";
            }
        },

        onExportPdf() {
            this.exportModal += 1;
            this.exportFormat = "pdf";
        },
        async onVerif(item) {
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
        /**
         * Ini di comment karena tidak ada fitur unverifikasi
         */
        // async onUnverif(item) {
        //     // let payload = {
        //     //     "lahan_no": item.lahan_no
        //     // }
        //     // console.log(payload);
        //     const prompt = await this.$_alert.confirm('Unverifikasi Data Lahan Umum?', 'Apakah anda yakin akan Unverifikasi Data Lahan Umum ini?', 'Ya, Unverifikasi', 'Batal', true)
        //     if (prompt.isConfirmed) {
        //         this.$_api.post('general-land/main/unverification', {
        //             lahan_no: item.lahan_no,
        //             verified_by: this.user.email,
        //         })
        //             .then(() => {
        //                 this.$_alert.success('Berhasil Melakukan Unverifikasi Lahan Umum')
        //                 this.refreshKey += 1
        //             })

        //     }
        // }
    },
};
</script>