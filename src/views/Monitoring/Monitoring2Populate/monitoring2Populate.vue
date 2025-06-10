<template>
    <geko-base-crud :config="config" :refreshKey="refreshKey" :hideUpdate="true" :hideDelete="true" :hideCreate="true">
        <template v-slot:detail-slave-raw="{ data }">
            <monitoring2-populate-detail :data="data"></monitoring2-populate-detail>
        </template>
        <template v-slot:list-bottom-action="{ item }">
            <v-btn  variant="primary" small class="d-flex flex-row align-items-center mt-2"
                @click="AssignDataPopulate(item)">
                <v-icon small>mdi-pencil-plus</v-icon>
                <span v-if="(item.assigned_to =='-' && item.sampling == '-') || (item.assigned_to == null && item.sampling == null)">Lengkapi Data Populasi</span>
                <span v-else>Edit Data Populasi</span>
            </v-btn>
            <v-btn v-if="(!(item.assigned_to == '-' && item.sampling == '-') || (item.assigned_to == null && item.sampling == null)) && item.is_monitoring == 0" variant="warning" small class="d-flex flex-row align-items-center mt-2"
                @click="OnResetAssignedData(item)">
                <v-icon small>mdi-alert-circle</v-icon>
                <span>Reset Data Populasi</span>
            </v-btn>
            <v-btn v-if="(!(item.assigned_to == '-' && item.sampling == '-') || (item.assigned_to == null && item.sampling == null)) && item.is_monitoring == 0" variant="success" small class="d-flex flex-row align-items-center mt-2"
                @click="onGenerateMonitoring(item)">
                <v-icon small>mdi-check-all</v-icon>
                <span>Generate Data Monitoring!</span>
            </v-btn>
            <v-btn v-if="item.is_monitoring == 0" variant="danger" small class="d-flex flex-row align-items-center mt-2"
                @click="onDeletePopulateData(item)">
                <v-icon small>mdi-backspace</v-icon>
                <span>Hapus Data Populasi</span>
            </v-btn>
        </template>
        <template v-slot:list-status_data="{ item }">
            <div class="pr-5 mr-5 d-flex flex-row" >
                <span v-if="(item.assigned_to =='-' && item.sampling == '-') || (item.assigned_to == null && item.sampling == null)" class="badge bg-danger mr-1">
                    <v-icon size="small">mdi-close</v-icon> Belum Melakukan Assignment Data! 
                </span>
                <span v-else-if="(!item.assigned_to == '-' && !item.sampling == '-') || (!item.assigned_to == null && !item.sampling == null) && item.is_monitoring == 0" class="badge bg-warning mr-1">
                    <v-icon size="small">mdi-alert-circle</v-icon> Data Sudah Lengkap! 
                </span>
                <span v-else-if="item.is_monitoring == 1" class="badge bg-success mr-1">
                    <v-icon size="small">mdi-check</v-icon> Data Monitoring Sudah Digenerate! 
                </span>
            </div>
        </template>
        <template v-slot:detail-status_data="{ item }">
            <div class="pr-5 mr-5 d-flex flex-row" >
            <!-- <div> -->
                <div>
                    <span v-if="(item.assigned_to =='-' && item.sampling == '-') || (item.assigned_to == null && item.sampling == null)" class="badge bg-danger mr-1">
                        <v-icon size="small">mdi-close</v-icon> Belum Melakukan Assignment Data! 
                    </span>
                    <span v-else-if="(!item.assigned_to == '-' && !item.sampling == '-') || (!item.assigned_to == null && !item.sampling == null) && item.is_monitoring == 0" class="badge bg-warning mr-1">
                        <v-icon size="small">mdi-alert-circle</v-icon> Data Sudah Lengkap! 
                    </span>
                    <span v-else-if="item.is_monitoring == 1" class="badge bg-success mr-1">
                        <v-icon size="small">mdi-check</v-icon> Data Monitoring Sudah Digenerate! 
                    </span>
                </div>
            </div>
        </template>
        <template v-slot:list-assigned_to="{ item }">
            {{ item.field_facilitators_name?? 'Belum Ditentukan!' }} ( {{ item.assigned_to?? '-' }} )
        </template>
        <template v-slot:detail-assigned_to="{ item }">
            {{ item.field_facilitators_name?? 'Belum Ditentukan!' }} ( {{ item.assigned_to?? '-' }} )
        </template>
        <template v-slot:list-after-filter>
            <monitoring2-populate-assignment-form :data="formData" :dataKey="formDataKey" @success="refreshKey = refreshKey + 1"></monitoring2-populate-assignment-form>
        </template>
    </geko-base-crud>

</template>

<script>
import maintenanceAnimation from "@/assets/lottie/maintenance.json";
import LottieAnimation from "lottie-web-vue";
import monitoring2PopulateConfig from "./Monitoring2PopulateComponent/monitoring2PopulateConfig";
import monitoring2PopulateDetail from "./monitoring2PopulateDetail.vue";
import Monitoring2PopulateAssignmentForm from "./Monitoring2PopulateComponent/Monitoring2PopulateAssignmentForm.vue";

export default {
    components: {
        LottieAnimation,
        monitoring2PopulateDetail,
        Monitoring2PopulateAssignmentForm
    },
    name: "crud-monitoring2Populate",
    watch: {},
    data() {
        return {
            user: {},
            refreshKey: 1,
            config: monitoring2PopulateConfig,
            lottie: maintenanceAnimation,
            formData: null,
            formDataKey: 0
        };
    },
    mounted() {
        const user = JSON.parse(localStorage.getItem("User"));
        this.user = user;
    },
    methods: {
        AssignDataPopulate(item){
            this.formData = item
            this.formDataKey += 1
            console.log('daata',this.formData)
        },
        async OnResetAssignedData(item){
            const prompt = await this.$_alert.confirm('Reset Assignment Populasi?', 'Apakah anda yakin Untuk Reset Data Assignment Populasi ini?', 'Ya, Reset', 'Batal', true)
            if (prompt.isConfirmed) {
                this.$_api.post('populate-monitoring/2-to-3/reset-assignment', {id: item.id})
                .then(() => {
                  this.$_alert.success('Berhasil Melakukan Reset Data Assignment!')
                  this.refreshKey += 1;
                })
            }
        },
        async onGenerateMonitoring(item){
            const prompt = await this.$_alert.confirm('Generate Data Populasi?', 'Harap Lakukan Dengan Teliti, Proses Ini Tidak Dapat Dikembalikan!', 'Ya, Generate!', 'Batal', true)
            if (prompt.isConfirmed) {
                // console.log(item)
                this.$_api.post('populate-monitoring/2-to-3/generate-monitoring', item)
                .then(() => {
                  this.$_alert.success('Berhasil Melakukan Generate Data Populasi Ke Monitoring!')
                  this.refreshKey += 1;
                })
            }
        },
        async onDeletePopulateData(item){
            const prompt = await this.$_alert.confirm('Hapus Data Populasi?', 'Apakah anda yakin Menghapus Data Populasi ini?', 'Ya, Hapus', 'Batal', true)
            var payload={
                id: item.id,
                is_monitoring: item.is_monitoring,
                monitoring2_no: item.monitoring_no
            }
            if (prompt.isConfirmed) {
                this.$_api.post('populate-monitoring/2-to-3/delete', payload)
                .then(() => {
                  this.$_alert.success('Berhasil Menghapus Data Populasi!')
                  this.refreshKey += 1;
                })
            }
        }
    },
};
</script>