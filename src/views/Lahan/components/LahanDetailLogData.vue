<template>


    <div class="d-flex flex-col log-data" v-if="data && data.main_lahan">
        <div class="log-data-item active">
            <div class="dot-wrapper">
                <div class="dot"></div>
            </div>
            <div class="log-value">
                <span class="time">{{
                    formatDate(
                        data.main_lahan.created_at,
                        "D MMMM YYYY HH:mm"
                    )
                }}</span>
                <span class="label">FF Menambahkan Data Lahan</span>
                <span class="user">FF: {{ data.main_lahan.field_facilitators_name }}</span>
            </div>
        </div>

        <div class="log-data-item" :class="{
            active: [0, 1].includes(data.main_lahan.fc_complete_data),
        }">
            <div class="dot-wrapper">
                <div class="dot"></div>
            </div>
            <div class="log-value">
                <span class="time" v-if="data.main_lahan.fc_complete_data_at">{{
                    formatDate(
                        data.main_lahan.fc_complete_data_at,
                        "D MMMM YYYY HH:mm"
                    )
                }}</span>
                <span class="label">FC Verifikasi Kelengkapan Data</span>
                <span class="user" v-if="data.main_lahan.fc_complete_data_by">{{
                    data.main_lahan.fc_complete_data_by }}</span>
            </div>
        </div>
        <div v-if="projectPurpose === 'carbon'" class="log-data-item" :class="{
            active: data.main_lahan.gis_updated_at,
        }">
            <div class="dot-wrapper">
                <div class="dot"></div>
            </div>
            <div class="log-value">
                <span class="time" v-if="data.main_lahan.gis_updated_at">{{
                    formatDate(
                        data.main_lahan.gis_updated_at,
                        "D MMMM YYYY HH:mm"
                    )
                }}</span>
                <span class="label">GIS Verifikasi Polygon & Data Lahan</span>
                <span class="user" v-if="data.main_lahan.gis_updated_at">{{ data.main_lahan.gis_officer }}</span>
            </div>
        </div>
        <div v-if="projectPurpose === 'carbon'" class="log-data-item" :class="{
            active: data.main_lahan.polygon_tutupan_status,
        }">
            <div class="dot-wrapper">
                <div class="dot"></div>
            </div>
            <div class="log-value">
                <span class="time" v-if="data.main_lahan.gis_update_eligibility_at">{{
                    formatDate(
                        data.main_lahan.gis_update_eligibility_at,
                        "D MMMM YYYY HH:mm"
                    )
                }}</span>
                <span class="label">GIS Verifikasi Polygon Tutupan &amp; Eligibilitas</span>
                <!-- <span class="user" v-if="data.main_lahan.gis_updated_at">{{ data.main_lahan.gis_officer }}</span> -->
            </div>
        </div>
        <div class="log-data-item" :class="{
            active: data.main_lahan.approve >= 1,
        }">
            <div class="dot-wrapper">
                <div class="dot"></div>
            </div>
            <div class="log-value">
                <span class="time" v-if="
                    data.main_lahan.approve >= 1 &&
                    data.main_lahan.approved_at
                ">{{
                    formatDate(
                        data.main_lahan.approved_at,
                        "D MMMM YYYY HH:mm"
                    )
                }}</span>
                <span class="label">FC Verifikasi Data Lahan</span>
                <span v-if="
                    data.main_lahan.approve >= 1 &&
                    data.main_lahan.approved_by
                " class="user">{{ data.main_lahan.approved_by }}</span>
            </div>
        </div>
        <div v-if="projectPurpose === 'carbon'" class="log-data-item" :class="{
            active: data.main_lahan.approve == 2,
        }">
            <div class="dot-wrapper">
                <div class="dot"></div>
            </div>
            <div class="log-value">
                <span class="time" v-if="
                    data.main_lahan.approve == 2 &&
                    data.main_lahan.update_eligible_at
                ">{{
                    formatDate(
                        data.main_lahan.update_eligible_at,
                        "D MMMM YYYY HH:mm"
                    )
                }}</span>
                <span class="label">UM Menentukan Eligibilitas Lahan</span>
                <span v-if="
                    data.main_lahan.approve == 2 &&
                    data.main_lahan.update_eligible_by
                " class="user">{{ data.main_lahan.update_eligible_by }}</span>
            </div>
        </div>
        <div v-if="projectPurpose === 'non-carbon'" class="log-data-item" :class="{
            active: data.main_lahan.approve == 2,
        }">
            <div class="dot-wrapper">
                <div class="dot"></div>
            </div>
            <div class="log-value">
                <span class="time" v-if="
                    data.main_lahan.approve == 2 &&
                    data.main_lahan.approved_at
                ">{{
                    formatDate(
                        data.main_lahan.approved_at,
                        "D MMMM YYYY HH:mm"
                    )
                }}</span>
                <span class="label">UM Verifikasi Data Lahan</span>
                <span v-if="
                    data.main_lahan.approve == 2 &&
                    data.main_lahan.approved_by
                " class="user">{{ data.main_lahan.approved_by }}</span>
            </div>
        </div>
    </div>
</template>

<script>
import moment from 'moment'
export default {
    name: 'lahan-detail-log-data',
    props: {
        data: {
            required: false
        },
        projectPurpose: {
            required: false
        },
    },
    data() {
        return {

            formatDate(date, format) {
                return moment(date).format(format);
            },
        }
    }
}
</script>