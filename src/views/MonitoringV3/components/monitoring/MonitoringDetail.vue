<template>
    <div v-if="data" class="pa-4">
        <v-divider class="my-5"></v-divider>
        <!-- DETAIL POHON -->
        <div v-if="treeDetailHeaders && treeDetailHeaders.length" class="mb-5">
            <h5 class="mb-4 text-success">
                <v-icon left color="success">mdi-tree-outline</v-icon> Detail Per Pohon
            </h5>
            <v-data-table :headers="treeDetailHeaders" :items="data.monitoring_detail || []" :items-per-page="10"
                class="elevation-1 border">
                <template v-slot:item.index="{ index }">
                    <span class="font-weight-bold">{{ index + 1 }}</span>
                </template>
            </v-data-table>
            <v-divider class="my-5"></v-divider>
        </div>

        <!-- AKUMULASI POHON -->
        <div v-if="monitoringTreeDetailHeaders && monitoringTreeDetailHeaders.length" class="mb-5">
            <h5 class="mb-4 text-info">
                <v-icon left color="info">mdi-format-list-bulleted-type</v-icon> Akumulasi Per Jenis Pohon
            </h5>
            <v-data-table :headers="monitoringTreeDetailHeaders" :items="data.monitoring_tree_detail || []"
                :items-per-page="10" class="elevation-1 border">
                <template v-slot:item.index="{ index }">
                    <span class="font-weight-bold">{{ index + 1 }}</span>
                </template>
            </v-data-table>
            <v-divider class="my-5"></v-divider>
        </div>

        <!-- FOTO DOKUMENTASI & AKUMULASI -->
        <h5 class="mb-4 text-secondary">
            <v-icon left color="secondary">mdi-camera</v-icon> Foto Dokumentasi & Akumulasi
        </h5>
        <div class="row">
            <!-- Foto Utama -->
            <div class="col-6 col-md-3 mb-3 text-center" v-if="data.photo1">
                <v-img :src="$_config.baseUrlUpload + '/' + data.photo1" aspect-ratio="1"
                    class="grey lighten-2 rounded border cursor-pointer" @click="showLightbox(data.photo1)"></v-img>
                <p class="mt-2 font-weight-bold text-muted">Dokumentasi 1</p>
            </div>
            <div class="col-6 col-md-3 mb-3 text-center" v-if="data.photo2">
                <v-img :src="$_config.baseUrlUpload + '/' + data.photo2" aspect-ratio="1"
                    class="grey lighten-2 rounded border cursor-pointer" @click="showLightbox(data.photo2)"></v-img>
                <p class="mt-2 font-weight-bold text-muted">Dokumentasi 2</p>
            </div>

            <!-- Foto Akumulasi (Mati / Hidup) -->
            <template v-if="data.tree_detail_acumulation && data.tree_detail_acumulation.length > 0">
                <div class="col-6 col-md-3 mb-3 text-center" v-if="data.tree_detail_acumulation[0].photo_dead">
                    <v-img :src="$_config.baseUrlUpload + '/' + data.tree_detail_acumulation[0].photo_dead"
                        aspect-ratio="1" class="grey lighten-2 rounded border cursor-pointer"
                        @click="showLightbox(data.tree_detail_acumulation[0].photo_dead)"></v-img>
                    <p class="mt-2 font-weight-bold text-muted">Akm. Pohon Mati</p>
                </div>
                <div class="col-6 col-md-3 mb-3 text-center" v-if="data.tree_detail_acumulation[0].photo_life">
                    <v-img :src="$_config.baseUrlUpload + '/' + data.tree_detail_acumulation[0].photo_life"
                        aspect-ratio="1" class="grey lighten-2 rounded border cursor-pointer"
                        @click="showLightbox(data.tree_detail_acumulation[0].photo_life)"></v-img>
                    <p class="mt-2 font-weight-bold text-muted">Akm. Pohon Hidup</p>
                </div>
            </template>
            <template v-else>
                <div class="col-12 text-center text-muted pa-4 border rounded bg-light">
                    <v-icon size="48" color="grey">mdi-image-off-outline</v-icon>
                    <p class="mt-2 mb-0">Foto akumulasi belum tersedia</p>
                </div>
            </template>
        </div>

        <v-divider class="my-5"></v-divider>


        <!-- STATISTIK PERTUMBUHAN -->
        <div v-if="data.life_tree_percentage != null" class="mb-5">
            <h5 class="mb-4 text-warning">
                <v-icon left color="warning">mdi-chart-donut</v-icon> Statistik Pertumbuhan Pohon
            </h5>
            <div class="row text-center px-4">
                <div class="col-12 col-md-4">
                    <p class="font-weight-bold mb-3">Persentase Pohon Hidup</p>
                    <v-progress-circular :rotate="360" :size="150" :width="15" :value="data.life_tree_percentage || 0"
                        :color="data.life_tree_percentage > 80 ? 'green' : (data.life_tree_percentage > 30 ? 'orange' : 'red')">
                        <h4 class="mb-0">{{ Number(data.life_tree_percentage || 0).toFixed(1) }}%</h4>
                    </v-progress-circular>
                    <p class="text-muted mt-3 mb-0">Total: {{ data.current_monitoring_total_trees || 0 }} / {{
                        data.previous_monitoring_total_trees || 0 }}</p>
                </div>
                <div class="col-12 col-md-8 d-flex flex-column justify-content-center align-items-center">
                    <v-chip color="primary" class="font-weight-bold mb-3" label x-large>
                        <v-icon left>mdi-arrow-up-bold</v-icon>
                        Tinggi Rata-rata: {{ Number(data.average_tree_length || 0).toFixed(2) }} cm
                    </v-chip>
                    <v-chip color="info" class="font-weight-bold" label x-large>
                        <v-icon left>mdi-diameter</v-icon>
                        Diameter Rata-rata: {{ Number(data.average_tree_diameter || 0).toFixed(2) }} cm
                    </v-chip>
                </div>
            </div>
            <v-divider class="my-5"></v-divider>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        data: { type: Object, required: true },
        treeDetailHeaders: { type: Array, default: () => [] },
        monitoringTreeDetailHeaders: { type: Array, default: () => [] }
    },
    methods: {
        showLightbox(imgs) {
            if (imgs) {
                this.$store.state.lightbox.imgs = this.$_config.baseUrlUpload + '/' + imgs;
                this.$store.state.lightbox.index = 0;
                this.$store.state.lightbox.show = true;
            }
        }
    }
}
</script>
