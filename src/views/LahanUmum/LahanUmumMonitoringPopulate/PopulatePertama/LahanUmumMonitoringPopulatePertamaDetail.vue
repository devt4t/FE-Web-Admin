<template>
    <v-card class="pa-4">
        <v-card-title class="headline">Detail Populasi Monitoring</v-card-title>
        <v-card-text>
            <v-row v-if="data && data.result">
                <v-col cols="12" md="6">
                    <v-simple-table>
                        <tbody>
                            <tr>
                                <td class="font-weight-bold">Kode Populasi</td>
                                <td>{{ data.result.populate_no || '-' }}</td>
                            </tr>
                            <tr>
                                <td class="font-weight-bold">Kode Realisasi Tanam</td>
                                <td>{{ data.result.monitoring_no || '-' }}</td>
                            </tr>
                            <tr>
                                <td class="font-weight-bold">Nomor Lahan</td>
                                <td>{{ data.result.lahan_no || '-' }}</td>
                            </tr>
                            <tr>
                                <td class="font-weight-bold">MoU No</td>
                                <td>{{ data.result.mou_no || '-' }}</td>
                            </tr>
                            <tr>
                                <td class="font-weight-bold">Management Unit</td>
                                <td>{{ data.result.managementunits_name || '-' }}</td>
                            </tr>
                            <tr>
                                <td class="font-weight-bold">PIC Lahan Umum</td>
                                <td>{{ data.result.lahan_umums_pic_lahan || '-' }}</td>
                            </tr>
                        </tbody>
                    </v-simple-table>
                </v-col>
                <v-col cols="12" md="6">
                    <v-simple-table>
                        <tbody>
                            <tr>
                                <td class="font-weight-bold">Tahun Program</td>
                                <td>{{ data.result.program_year || '-' }}</td>
                            </tr>
                            <tr>
                                <td class="font-weight-bold">Tanggal Tanam</td>
                                <td>{{ data.result.planting_date | formatDate }}</td>
                            </tr>
                            <tr>
                                <td class="font-weight-bold">Metode Sampling</td>
                                <td>{{ data.result.sampling || 'Belum Ditentukan' }}</td>
                            </tr>
                            <tr>
                                <td class="font-weight-bold">FF Petugas Monitoring</td>
                                <td>{{ data.result.field_facilitators_name || 'Belum Ditentukan' }} ({{ data.result.assigned_to || '-' }})</td>
                            </tr>
                            <tr>
                                <td class="font-weight-bold">Status Monitoring</td>
                                <td>
                                    <v-chip :color="data.result.is_monitoring == 1 ? 'success' : 'warning'" small>
                                        {{ data.result.is_monitoring == 1 ? 'Sudah Digenerate' : 'Belum Digenerate' }}
                                    </v-chip>
                                </td>
                            </tr>
                        </tbody>
                    </v-simple-table>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script>
export default {
    name: "LahanUmumMonitoringPopulatePertamaDetail",
    props: {
        data: {
            type: Object,
            default: () => ({}),
        },
    },
    filters: {
        formatDate(value) {
            if (!value) return '-';
            const date = new Date(value);
            return date.toLocaleDateString('id-ID', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            });
        }
    }
};
</script>
