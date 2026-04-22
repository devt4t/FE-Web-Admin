<template>
    <div class="d-flex flex-row">
        <span v-if="isNotAssigned" class="badge bg-danger mr-1">
            <v-icon size="small">mdi-close</v-icon> Belum Assignment!
        </span>
        <span v-else-if="isAssignedNotMonitored" class="badge bg-warning mr-1">
            <v-icon size="small">mdi-alert-circle</v-icon> Data Sudah Lengkap!
        </span>
        <span v-else-if="item.is_monitoring == 1" class="badge bg-success mr-1">
            <v-icon size="small">mdi-check</v-icon> Monitoring Sudah Digenerate!
        </span>
    </div>
</template>
<script>
export default {
    props: { item: { required: true } },
    computed: {
        isNotAssigned() {
            const { assigned_to } = this.item
            return assigned_to == null || assigned_to === '-' || assigned_to === ''
        },
        isAssignedNotMonitored() {
            return !this.isNotAssigned && this.item.is_monitoring == 0
        }
    }
}
</script>