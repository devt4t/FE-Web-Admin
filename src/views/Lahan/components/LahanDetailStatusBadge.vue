<template>
    <div class="lahan-side-item">
        <p class="mb-0 label">Status</p>

        <!--
                  STATUS LAHAN CARBON
                  - Belum Diverifikasi
                  - Diverifikasi GIS
                  - Diverifikasi FC
                  - Terverifikasi


                  STATUS LAHAN NON CARBON
                  - Belum Diverifikasi
                  - Diverifikasi FC
                  - Terverifikasi / Force Majeure
                -->

        <!-- STATUS CARBON -->
        <div class="d-flex flex-row value" v-if="projectPurpose === 'carbon'">
            <span :class="{
                'badge bg-warning':
                    data.main_lahan.approve == 0 &&
                    data.main_lahan.updated_gis.toLowerCase() == 'belum',
                'badge bg-info':
                    data.main_lahan.approve == 0 &&
                    data.main_lahan.updated_gis.toLowerCase() == 'sudah',
                'badge bg-primary':
                    data.main_lahan.approve == 1 &&
                    data.main_lahan.fc_complete_data != null,
                'badge bg-success': data.main_lahan.approve == 2,
                'badge bg-danger':
                    data.main_lahan.approve == 3 ||
                    (data.main_lahan.approve == 1 &&
                        data.main_lahan.fc_complete_data == null),
            }">
                <span v-if="
                    data.main_lahan.approve == 1 &&
                    data.main_lahan.fc_complete_data == null
                ">Data Bermasalah</span>
                <span v-else-if="
                    data.main_lahan.approve == 0 &&
                    data.main_lahan.updated_gis.toLowerCase() == 'belum'
                ">Belum Diverifikasi</span>
                <span v-else-if="
                    data.main_lahan.approve == 0 &&
                    data.main_lahan.updated_gis.toLowerCase() == 'sudah'
                ">Diverifikasi GIS</span>
                <span v-else-if="data.main_lahan.approve == 1">Diverifikasi FC</span>
                <span v-else-if="data.main_lahan.approve == 2">Terverifikasi</span>
                <span v-else-if="data.main_lahan.approve == 3">Force Majeure</span>
            </span>
        </div>
        <!-- STATUS NON CARBON -->
        <div class="d-flex flex-row value" v-if="projectPurpose === 'non-carbon'">
            <span class="badge" :class="{
                'bg-warning':
                    data.main_lahan.approve === 0 &&
                    data.main_lahan.fc_complete_data === null,
                'bg-primary':
                    data.main_lahan.approve === 1 &&
                    data.main_lahan.fc_complete_data !== null,
                'bg-success': data.main_lahan.approve === 2,
            }">
                <span v-if="
                    data.main_lahan.approve === 0 &&
                    data.main_lahan.fc_complete_data === null
                ">Belum Diverifikasi</span>
                <span v-else-if="
                    data.main_lahan.approve === 1 &&
                    data.main_lahan.fc_complete_data !== null
                ">Data Lahan Terverifikasi</span>
                <span v-else-if="data.main_lahan.approve === 2">Terverifikasi</span>
            </span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'lahan-detail-status-badge',
    props: {
        data: {
            required: false,
        },
        projectPurpose: {
            required: false
        }
    }
}
</script>