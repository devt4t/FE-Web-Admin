<template>
    <geko-base-crud :config="config" :refreshKey="refreshKey" :hideUpdate="true" :hideDelete="true">
        <template v-if="$_sys.isAllowed('pelatihan-petani-export-create')" v-slot:list-bottom-action="{ item }">
            <v-btn v-if="item.is_verified == 2 && $_sys.isAllowed('lahan-umum-update')" variant="danger" small
                class="mt-2" @click="onUnverif(item)">
                <v-icon left small>mdi-undo</v-icon>
                <span>Unverifikasi</span>
            </v-btn>
            <v-btn v-else-if="item.is_verified == 1 && $_sys.isAllowed('lahan-umum-update')" variant="success" small
                class="mt-2" @click="onVerif(item)">
                <v-icon left small>mdi-check-bold</v-icon>
                <span>Verifikasi</span>
            </v-btn>
        </template>
        <template v-slot:detail-slave-raw="{ data }">
            <!-- <lahan-umum-planting-hole-detail-map
              :long="data.result.longitude"
              :lat="data.result.latitude"
              :section="`LahanUmum`"
            /> -->
            <lahan-umum-planting-hole-detail :data="data"></lahan-umum-planting-hole-detail>
        </template>
        <template v-slot:create-form>
            <lahan-umum-planting-hole-create :user="user"></lahan-umum-planting-hole-create>
        </template>
    </geko-base-crud>

</template>

<script>
import maintenanceAnimation from "@/assets/lottie/maintenance.json";
import LottieAnimation from "lottie-web-vue";
import LahanUmumPlantingHoleConfig from "./LahanUmumPlantingHoleConfig";
import LahanUmumPlantingHoleDetail from "./LahanUmumPlantingHoleDetail.vue";
import LahanUmumPlantingHoleDetailMap from "@/views/Lahan/components/DetailLahanMap";
import LahanUmumPlantingHoleCreate from "./lahanUmumPlantingHoleCreate.vue"

export default {
    components: {
        LottieAnimation,
        LahanUmumPlantingHoleDetail,
        LahanUmumPlantingHoleDetailMap,
        LahanUmumPlantingHoleCreate
    },
    name: "crud-public-land-planting-hole",
    watch: {},
    data() {
        return {
            user: {},
            refreshKey: 1,
            config: {
                export: true,
                title: "Penilikan Lubang Lahan Umum / Event",
                getter: "lahan-umum/planting-hole/list",
                getterDataKey: "result",
                totalDataKey: 'total',
                detail: "lahan-umum/planting-hole/detail",
                detailIdKey: "id",
                detailKey: "result",
                deleteKey: "id",
                pk_field: null,
                globalFilter: {
                    program_year: {
                        setter: "program_year",
                    },
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
                fields: LahanUmumPlantingHoleConfig,
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
            const prompt = await this.$_alert.confirm('Verifikasi Data Penilikan Lubang Lahan Umum?', 'Apakah anda yakin akan Verifikasi Data Penilikan Lubang Lahan Umum ini?', 'Ya, Verifikasi', 'Batal', true)
            if (prompt.isConfirmed) {
                this.$_api.post('PlantingHoleVerificationLahanUmum', {
                lahan_no: item.lahan_no,
                verified_by: this.user.email,
                })
                .then(() => {
                    this.$_alert.success('Berhasil Melakukan Verifikasi Penilikan Lubang Lahan Umum, Silahkan Melanjutkan Proses Distribusi & BAST (Hubungi Nursery)')
                    this.refreshKey += 1
                })

            }
        },
        async onUnverif(item){
            // let payload = {
            //     "lahan_no": item.lahan_no
            // }
            // console.log(payload);
            const prompt = await this.$_alert.confirm('Verifikasi Data Penilikan Lubang Lahan Umum?', 'Apakah anda yakin akan Verifikasi Data Penilikan Lubang Lahan Umum ini?', 'Ya, Verifikasi', 'Batal', true)
            if (prompt.isConfirmed) {
                this.$_api.post('UnverificationLahanUmum', {
                lahan_no: item.lahan_no,
                verified_by: this.user.email,
                })
                .then(() => {
                    this.$_alert.success('Berhasil Melakukan Verifikasi Penilikan Lubang Lahan Umum, Silahkan Melanjutkan Proses Distribusi & BAST (Hubungi Nursery)')
                    this.refreshKey += 1
                })

            }
        }
    },
};
</script>