<template>
    <geko-base-crud :config="config" :refreshKey="refreshKey" :hideUpdate="true" :hideDelete="true" :hideCreate="true">
        <template v-slot:list-bottom-action="{ item }">
            <v-btn v-if="item.is_validate" variant="danger" small class="mt-2" @click="onUnverif(item)">
                <v-icon left small>mdi-undo</v-icon>
                <span>Unverifikasi</span>
            </v-btn>
            <v-btn v-else variant="success" small class="mt-2" @click="onVerif(item)">
                <v-icon left small>mdi-check-bold</v-icon>
                <span>Verifikasi</span>
            </v-btn>
        </template>
    </geko-base-crud>
    <!-- <div class="under-development">
        <div class="wrapper">
        <div class="text-wrapper">
            <h3>{{ $route.name.replace(/([a-z])([A-Z])/g, "$1 $2") }} Module</h3>
            <p class="mb-0 pb-0">is Under Development</p>
        </div>
        <LottieAnimation
            ref="anim"
            :animationData="lottie"
            :loop="true"
            style="height: 70vh"
        />
        </div>
    </div> -->
</template>

<script>
import plantingHoleDetail from "./PlantingHoleDetail.vue"
import maintenanceAnimation from "@/assets/lottie/maintenance.json";
import plantingHoleConfig from "./PlantingHoleConfig";
import LottieAnimation from "lottie-web-vue";
export default {
    components: {
        LottieAnimation,
        plantingHoleDetail
    },
    name: "crud-planting-hole",
    watch: {},
    data() {
        return {
            refreshKey: 1,
            config: {
                title: "Lubang Tanam",
                getter: "new-planting-hole/list/main",
                getterDataKey: "data",
                totalDataKey: 'total',
                
                deleteKey: "id",
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
                    detail: "lubang-tanam-detail",
                },
                slave: [],
                fields: plantingHoleConfig,
            },
            lottie: maintenanceAnimation,
        };
    },
    mounted() {
        const user = JSON.parse(localStorage.getItem("User"));
        this.user = user;
    },
    methods:{
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
    },
};
</script>