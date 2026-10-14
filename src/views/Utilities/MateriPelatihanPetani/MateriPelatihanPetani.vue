<template>
    <geko-base-crud :config="config" :hideDelete="false" :hideUpdate="false" :hideCreate="false"
        :refreshKey="refreshKey">
        <template v-slot:list-indicator="{ item }">
        </template>

        <!-- custom delete -->
        <template v-slot:geko-list-action-delete="{ item }">
            <button class="geko-list-action-delete" title="Hapus Materi" @click="confirmDelete(item)">
                <v-icon small>mdi-trash-can-outline</v-icon>
            </button>
        </template>
    </geko-base-crud>
</template>

<script>
import config from './MateriPelatihanPetaniConfig.js';

export default {
    name: 'MateriPelatihanPetani',
    data() {
        return {
            refreshKey: 0,
            config,
        };
    },
    methods: {
        async confirmDelete(item) {
            const prompt = await this.$_alert.confirm(
                'Konfirmasi Hapus Data',
                `Apakah Anda yakin ingin menghapus materi [${item.material_no}] "${item.material_name}"? Data yang dihapus tidak dapat dikembalikan.`,
                'Ya, Hapus!',
                'Batalkan',
                true
            );

            if (prompt.isConfirmed) {
                try {
                    await this.$_api.post(this.config.delete, { id: item.id });
                    this.$_alert.success('Berhasil', 'Materi pelatihan berhasil dihapus');
                    this.refreshKey += 1;
                } catch (error) {
                    // Error response otomatis ditangani oleh interceptor $_api / service.js
                }
            }
        },
    },
};
</script>