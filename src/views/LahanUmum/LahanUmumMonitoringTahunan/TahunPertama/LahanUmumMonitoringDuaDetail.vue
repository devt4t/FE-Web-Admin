<template>
    <div>
        <v-row>
            <!-- Tabel detail pohon -->
            <v-col>
                <v-card data-aos="fade-up" data-aos-delay="100" data-aos-duration="800"
                    class="geko-base-detail-card mb-5">
                    <v-data-table :headers="tableHeaders" :items="data ? data.list_detail : []"
                        class="rounded-xl elevation- pa-1 px-5">
                        <template v-slot:item.index="{ index }">
                            {{ index + 1 }}
                        </template>

                        <template v-slot:top>
                            <div class="list-header py-3 mt-1">
                                <div class="pr-5 mr-5 d-flex flex-row" style="justify-content: space-between">
                                    <h4>Detail Pohon Monitoring Lahan Umum</h4>
                                </div>
                                <div class="d-flex flex-row geko-list-header-action">
                                    <div class="geko-list-header-toolbar"></div>
                                </div>
                            </div>
                        </template>
                    </v-data-table>
                </v-card>
            </v-col>
        </v-row>
    </div>
</template>

<script>
export default {
    name: "lahan-umum-monitoring-detail",
    components: {},
    props: {
        data: {
            required: true,
            default: () => ({}),
        },
    },
    data() {
        return {
            tableHeaders: [
                { key: "index", text: "No", value: "index", sortable: false },
                { key: "tree_name", text: "Nama Pohon", value: "tree_name", sortable: false },
                { key: "amount", text: "Jumlah", value: "amount", sortable: false },
            ],
        };
    },
}
</script>