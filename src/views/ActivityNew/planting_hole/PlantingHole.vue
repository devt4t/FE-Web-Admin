<template>
    <geko-base-crud :config="config" :refreshKey="refreshKey" :hideUpdate="true" :hideCreate="true"
        @onExportExcel="onExportExcel($event)" @onExportPdf="onExportPdf($event)">
        <template v-slot:list-bottom-action="{ item }">
            <v-btn v-if="item.is_validate" variant="danger" small class="mt-2" @click="onUnverif(item)">
                <v-icon left small>mdi-undo</v-icon>
                <span>Unverifikasi</span>
            </v-btn>
            <v-btn v-else variant="success" small class="mt-2" @click="onVerif(item)">
                <v-icon left small>mdi-check-bold</v-icon>
                <span>Verifikasi</span>
            </v-btn>

            <v-btn variant="warning" small class="mt-2" @click="sync(item)">
                <v-icon left small>mdi-sync</v-icon>
                <span>Sync</span>
            </v-btn>
        </template>

        <template v-slot:list-ff_id="{ item }">
            <span class="d-block">
            {{ item.field_facilitators_name }}</span>

            <v-tooltip top>
            <template v-slot:activator="{ on }">
                <span v-on="on" class="text-08-em badge bg-light mt-1">{{
                item.user_id
                }}</span>
            </template>

            <span>Kode FF</span>
            </v-tooltip>
        </template>

        <template v-slot:list-farmer_id="{ item }">
            <span class="d-block">
            {{ item.farmers_name }}</span>

            <v-tooltip top>
            <template v-slot:activator="{ on }">
                <span v-on="on" class="text-08-em badge bg-light mt-1">{{
                item.lahans_farmer_no
                }}</span>
            </template>

            <span>Kode Petani</span>
            </v-tooltip>
        </template>

        <template v-slot:detail-slave-raw="{ data }">
            <planting-hole-detail :data="data"></planting-hole-detail>
        </template>
        <template v-slot:detail-action="{ item }">
            <div>
                <v-btn v-if="!item.is_validate" variant="success" @click="onVerifDetail(item)"><v-icon left
                        small>mdi-check-bold</v-icon>Verifikasi</v-btn>
                <v-btn v-else variant="danger" @click="onUnverifDetail(item)"><v-icon left
                        small>mdi-undo</v-icon>Unverifikasi</v-btn>
            </div>
        </template>

        <template v-slot:list-before-create>
            <export-modal :dataKey="exportModal" :format="exportFormat" />
        </template>

    </geko-base-crud>
</template>

<script>
import plantingHoleDetail from "./PlantingHoleDetail.vue"
import maintenanceAnimation from "@/assets/lottie/maintenance.json";
import plantingHoleConfig from "./PlantingHoleConfig";
import LottieAnimation from "lottie-web-vue";
import ExportModal from "./ExportModal.vue";


export default {
    components: {
        LottieAnimation,
        plantingHoleDetail,
        ExportModal
    },
    name: "crud-planting-hole",
    watch: {},
    data() {
        return {
            refreshKey: 1,
            config: {
                export: true,
                title: "Lubang Tanam",
                getter: "new-planting-hole/list/main",
                getterDataKey: "data",
                totalDataKey: 'total',
                detail: "new-planting-hole/detail/main",
                detailIdKey: "ph_form_no",
                detailKey: "result",
                delete: "new-planting-hole/delete/main-data",
                deleteKey: "ph_form_no",
                pk_field: null,
                globalFilter: {
                    program_year: {
                        setter: "program_year",
                    },
                },
                filter_api: {
                    typegetdata: 'all'
                },
                permission: {
                    create: "lubang-tanam-create",
                    read: "lubang-tanam-list",
                    update: "lubang-tanam-update",
                    detail: "lubang-tanam-detail",
                    lookup: "lubang-tanam-lookup",
                    delete: "lubang-tanam-delete",
                },
                slave: [],
                fields: plantingHoleConfig,
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
            const prompt = await this.$_alert.confirm('Verifikasi Penilikan Lubang?', 'Apakah Anda Yakin Untuk Melakukan VERIFIKASI Data Penilikan Lubang?', 'Ya, Verifikasi', 'Batal', true)
            if (prompt.isConfirmed) {
                this.$_api.post('new-planting-hole/update/validation', {
                    ph_form_no: item.ph_form_no,
                    validation_type: 'validate',
                    validate_by: this.user.employee_no
                })
                    .then(() => {
                        this.$_alert.success('Data Penilikan Lubang Berhasil Diverifikasi')
                        this.refreshKey += 1
                    })
            }
            console.log(item.ph_form_no)
        },
        async onUnverif(item) {
            const prompt = await this.$_alert.confirm('Unverifikasi Penilikan Lubang?', 'Apakah Anda Yakin Untuk Melakukan UNVERIFIKASI Data Penilikan Lubang?', 'Ya, Unverifikasi', 'Batal', true)
            if (prompt.isConfirmed) {
                this.$_api.post('new-planting-hole/update/validation', {
                    ph_form_no: item.ph_form_no,
                    validation_type: 'unvalidate',
                    validate_by: this.user.employee_no,
                })
                    .then(() => {
                        this.$_alert.success('Pelatihan berhasil diunverifikasi')
                        this.refreshKey += 1
                    })

            }
            console.log(item.ph_form_no)
        },
        async sync(item) {
            const prompt = await this.$_alert.confirm('Synchronise Penilikan Lubang?', 'Apakah Anda Yakin Untuk Melakukan SINKRONISASI Data Penilikan Lubang?', 'Ya, Sinkronkan', 'Batal', true)
            if (prompt.isConfirmed) {
                this.$_api.post('new-planting-hole/sync/seed', {
                    ph_form_no: item.ph_form_no,
                    program_year: this.$store.state.programYear.model,
                    lahan_no: item.lahan_no,
                })
                    .then(() => {
                        this.$_alert.success('Data Penilikan Lubang Berhasil Disinkronkan')
                        this.refreshKey += 1
                    })
            }
        },
        async onVerifDetail(item) {
            this.$router.go(-1);
            await this.onVerif(item);
        },
        async onUnverifDetail(item) {
            this.$router.go(-1);
            await this.onUnverif(item);
        },
        onExportExcel(data) {
            this.exportModal += 1;
            this.exportFormat = "excel";
        },
        onExportPdf(data) {
            this.exportModal += 1;
            this.exportFormat = "pdf";
        }
    },
};
</script>