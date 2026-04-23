<template>
    <div v-if="data" class="pa-4">
        <v-divider class="my-5"></v-divider>
        <!-- DETAIL POHON -->
        <div v-if="treeDetailHeaders && treeDetailHeaders.length" class="mb-5">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h5 class="text-success mb-0">
                    <v-icon left color="success">mdi-tree-outline</v-icon> Detail Per Pohon
                </h5>
                <v-text-field v-model="searchTreeDetail" append-icon="mdi-magnify" label="Cari Kode Pohon..."
                    single-line hide-details dense outlined style="max-width: 300px;"></v-text-field>
            </div>
            <v-data-table :headers="treeDetailHeaders" :items="data.monitoring_detail || []" :items-per-page="10"
                :search="searchTreeDetail" class="elevation-1 border">
                <template v-slot:item.index="{ index }">
                    <span class="font-weight-bold">{{ index + 1 }}</span>
                </template>
            </v-data-table>
            <v-divider class="my-5"></v-divider>
        </div>

        <!-- AKUMULASI POHON -->
        <div v-if="monitoringTreeDetailHeaders && monitoringTreeDetailHeaders.length" class="mb-5">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h5 class="text-info mb-0">
                    <v-icon left color="info">mdi-format-list-bulleted-type</v-icon> Akumulasi Per Jenis Pohon
                </h5>
                <v-text-field v-model="searchTreeAcumulation" append-icon="mdi-magnify" label="Cari Jenis Pohon..."
                    single-line hide-details dense outlined style="max-width: 300px;"></v-text-field>
            </div>
            <v-data-table :headers="monitoringTreeDetailHeaders" :items="data.monitoring_tree_detail || []"
                :search="searchTreeAcumulation" :items-per-page="10" class="elevation-1 border">
                <template v-slot:item.index="{ index }">
                    <span class="font-weight-bold">{{ index + 1 }}</span>
                </template>
            </v-data-table>
            <v-divider class="my-5"></v-divider>
        </div>

        <!-- GABUNGAN FOTO & STATISTIK (COMPACT MODE) -->
        <v-row class="mb-5 px-2">

            <!-- KOLOM KIRI: FOTO DOKUMENTASI -->
            <v-col cols="12" md="5">
                <h6 class="mb-3 text-primary font-weight-bold">
                    <v-icon left small color="primary">mdi-image-multiple</v-icon> Dokumentasi Akumulasi
                </h6>

                <template v-if="data.accumulated_photos && data.accumulated_photos.length > 0">
                    <!-- Gunakan flex dengan overflow-x agar bisa di-scroll ke samping kalau foto banyak -->
                    <div class="d-flex overflow-x-auto py-1">
                        <v-img v-for="(img, idx) in data.accumulated_photos" :key="idx"
                            :src="$_config.baseUrlUpload + '/' + img" width="70" height="70"
                            class="rounded mr-2 flex-shrink-0 cursor-pointer elevation-1" @click="showLightbox(img)">
                            <template v-slot:placeholder>
                                <v-row class="fill-height ma-0" align="center" justify="center">
                                    <v-progress-circular indeterminate size="20"
                                        color="grey lighten-5"></v-progress-circular>
                                </v-row>
                            </template>
                        </v-img>
                    </div>
                </template>
                <template v-else>
                    <!-- Empty state yang jauh lebih minimalis -->
                    <div class="text-muted border rounded pa-2 d-flex align-items-center justify-content-center bg-light"
                        style="max-width: max-content;">
                        <v-icon size="20" color="grey" class="mr-2">mdi-image-off-outline</v-icon>
                        <span class="small">Belum ada foto</span>
                    </div>
                </template>
            </v-col>

            <!-- KOLOM KANAN: STATISTIK PERTUMBUHAN -->
            <v-col cols="12" md="7">
                <h6 class="mb-3 text-warning font-weight-bold">
                    <v-icon left small color="warning">mdi-chart-line</v-icon> Statistik Pertumbuhan
                </h6>

                <!-- Tambahkan h-100 agar tinggi box sama dengan box dokumentasi di sebelahnya -->
                <div class="d-flex align-center justify-space-between bg-light border rounded pa-3 h-100">

                    <!-- Metrik 1: Persentase -->
                    <div class="text-center" style="flex: 1; border-right: 1px solid #dee2e6;">
                        <p class="font-weight-bold mb-2">Persentase Pohon Hidup</p>
                        <!-- Saya turunkan ukurannya sedikit ke 120 agar lebih compact & tidak mendesak -->
                        <v-progress-circular :rotate="360" :size="120" :width="12"
                            :value="data.life_tree_percentage || 0"
                            :color="data.life_tree_percentage > 80 ? 'green' : (data.life_tree_percentage > 30 ? 'orange' : 'red')">
                            <span class="font-weight-bold">{{ Number(data.life_tree_percentage || 0).toFixed(1)
                            }}%</span>
                        </v-progress-circular>
                        <div class="small text-muted mt-2">
                            {{ data.current_monitoring_total_trees || 0 }} / {{ data.previous_monitoring_total_trees ||
                                0 }}
                            Hidup
                        </div>
                    </div>

                    <!-- Metrik 2 & 3: Rata-rata -->
                    <div class="text-center d-flex flex-column justify-center" style="flex: 1">
                        <p class="font-weight-bold mb-3">Rata-rata Pertumbuhan</p>

                        <div class="d-flex justify-center align-center">
                            <!-- Metrik 2: Tinggi -->
                            <div class="text-center px-4">
                                <v-icon color="primary" class="mb-1" size="24">mdi-arrow-up-bold</v-icon>
                                <h5 class="mb-0 font-weight-bold">{{ Number(data.average_tree_length || 0).toFixed(1) }}
                                </h5>
                                <div class="small text-muted">cm (Tinggi)</div>
                            </div>

                            <!-- INI CARA BIKIN GARIS PEMISAH VERTIKAL -->
                            <v-divider vertical style="height: 40px; align-self: center;"></v-divider>

                            <!-- Metrik 3: Diameter -->
                            <div class="text-center px-4">
                                <v-icon color="info" class="mb-1" size="24">mdi-diameter</v-icon>
                                <h5 class="mb-0 font-weight-bold">{{ Number(data.average_tree_diameter || 0).toFixed(1)
                                }}</h5>
                                <div class="small text-muted">cm (Diameter)</div>
                            </div>
                        </div>

                    </div>

                </div>
            </v-col>
        </v-row>

        <v-divider class="my-5"></v-divider>

    </div>
</template>

<script>
export default {
    props: {
        data: { type: Object, required: true },
        treeDetailHeaders: { type: Array, default: () => [] },
        monitoringTreeDetailHeaders: { type: Array, default: () => [] }
    },
    data() {
        return {
            searchTreeDetail: '',
            searchTreeAcumulation: ''
        }
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
