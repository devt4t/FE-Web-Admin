<template>
    <div v-if="data" class="pa-4">
        <!-- INFORMASI UTAMA MONITORING -->
        <h5 class="mb-4 text-primary">
            <v-icon left color="primary">mdi-file-document-outline</v-icon> Informasi Data Monitoring
        </h5>
        <div class="row bg-light pa-3 rounded border mb-5">
            <div class="col-12 col-md-4 col-lg-3 mb-3" v-for="(field, index) in config.fields" :key="index">
                <template v-if="field.methods.detail">
                    <p class="font-weight-bold mb-0 text-muted" style="font-size: 0.85em;">
                        {{ field.label }}
                    </p>

                    <div v-if="field.id === 'is_verified'">
                        <span class="badge mt-1" :class="{
                            'bg-danger': data.is_verified == 0,
                            'bg-warning text-dark': data.is_verified == 1,
                            'bg-success': data.is_verified == 2
                        }">
                            <v-icon size="x-small" color="white" class="mr-1">
                                {{ data.is_verified == 0 ? 'mdi-close' : (data.is_verified == 1 ? 'mdi-alert' :
                                    'mdi-check') }}
                            </v-icon>
                            {{ data.is_verified == 0 ? 'Belum Diverifikasi' : data.is_verified == 1 ? 'Terverifikasi FC'
                                : 'Terverifikasi UM' }}
                        </span>
                    </div>

                    <div v-else>
                        <p class="mb-0 font-weight-medium">{{ data[field.id] !== null && data[field.id] !== '' ?
                            data[field.id] : '-' }}</p>
                    </div>
                </template>
            </div>
        </div>

        <v-divider class="my-5"></v-divider>

        <!-- PETA LOKASI -->
        <h5 class="mb-4 text-info">
            <v-icon left color="info">mdi-map-marker-radius</v-icon> Titik Koordinat Tanam
        </h5>
        <div class="row bg-light pa-3 rounded border mb-5 mx-0">
            <div class="col-12 text-center"
                style="min-height: 250px; display: flex; align-items: center; justify-content: center; flex-direction: column;">
                <v-icon size="64" color="grey lighten-1">mdi-map-outline</v-icon>
                <p class="text-muted mt-2">
                    Visualisasi Map akan di-load di sini. <br>
                    <strong>Lat:</strong> {{ data.latitude || '-' }} &nbsp;|&nbsp; <strong>Lng:</strong> {{
                        data.longitude ||
                        '-' }}
                </p>
                <!-- Nanti bisa copasin box "mapboxgl" ke sini -->
            </div>
        </div>

        <v-divider class="my-5"></v-divider>

        <!-- STATISTIK PERTUMBUHAN -->
        <div v-if="data.life_tree_percentage !== undefined" class="mb-5">
            <h5 class="mb-4 text-warning">
                <v-icon left color="warning">mdi-chart-donut</v-icon> Statistik Pertumbuhan Pohon
            </h5>
            <div class="row text-center px-4">
                <div class="col-12 col-md-4">
                    <p class="font-weight-bold mb-3">Persentase Pohon Hidup</p>
                    <v-progress-circular :rotate="360" :size="150" :width="15" :value="data.life_tree_percentage"
                        :color="data.life_tree_percentage > 80 ? 'green' : (data.life_tree_percentage > 30 ? 'orange' : 'red')">
                        <h4 class="mb-0">{{ data.life_tree_percentage.toFixed(1) }}%</h4>
                    </v-progress-circular>
                    <p class="text-muted mt-3 mb-0">Total: {{ data.current_monitoring_total_trees || 0 }} / {{
                        data.previous_monitoring_total_trees || 0 }}</p>
                </div>
                <div class="col-12 col-md-8 d-flex flex-column justify-content-center align-items-center">
                    <v-chip color="primary" class="font-weight-bold mb-3" label x-large>
                        <v-icon left>mdi-arrow-up-bold</v-icon>
                        Tinggi Rata-rata: {{ data.average_tree_length ? data.average_tree_length.toFixed(2) : 0 }} cm
                    </v-chip>
                    <v-chip color="info" class="font-weight-bold" label x-large>
                        <v-icon left>mdi-diameter</v-icon>
                        Diameter Rata-rata: {{ data.average_tree_diameter ? data.average_tree_diameter.toFixed(2) : 0 }}
                        cm
                    </v-chip>
                </div>
            </div>
            <v-divider class="my-5"></v-divider>
        </div>

        <!-- DETAIL POHON -->
        <div v-if="config.treeDetailHeaders" class="mb-5">
            <h5 class="mb-4 text-success">
                <v-icon left color="success">mdi-tree-outline</v-icon> Detail Per Pohon
            </h5>
            <v-data-table :headers="config.treeDetailHeaders" :items="data.monitoring_tree_detail || []"
                :items-per-page="5" class="elevation-1 border">
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
        </div>

    </div>
</template>

<script>
export default {
    props: {
        data: { type: Object, required: true },
        config: { type: Object, required: true }
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
