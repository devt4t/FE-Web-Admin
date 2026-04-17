<template>
    <div v-if="data" class="pa-2">
        <h4 class="mb-4">
            <v-icon class="mr-1">mdi-clipboard-text</v-icon>
            Informasi Data Populasi
        </h4>
        <div class="row">
            <!-- Loop Dinamis melalui SEMUA field yang diatur di config.fields -->
            <div class="col-12 col-md-6 mb-2" v-for="(field, index) in config.fields" :key="index">
                <template v-if="field.methods.detail">
                    <p class="font-weight-bold mb-0" style="color: gray; font-size: 0.85em;">
                        {{ field.label }}
                    </p>

                    <!-- Kondisi Render Khusus Status & Assign (mirip list-slot kita) -->
                    <div v-if="field.id === 'status_data'">
                        <status-badge :item="data" />
                    </div>

                    <div v-else-if="field.id === 'assigned_to'">
                        <p class="mb-0">
                            {{ data.field_facilitators_name ?? 'Belum Ditentukan!' }}
                            ({{ data.assigned_to ?? '-' }})
                        </p>
                    </div>

                    <!-- Untuk Sisanya (Termasuk Field Baru Nantinya) -->
                    <div v-else>
                        <p class="mb-0">
                            {{ data[field.id] ? data[field.id] : '-' }}
                        </p>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
import StatusBadge from './StatusBadge.vue';

export default {
    components: { StatusBadge },
    props: {
        data: { type: Object, required: true },
        config: { type: Object, required: true }
    }
}
</script>
