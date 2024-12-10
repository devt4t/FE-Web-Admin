<template>
    <div class="seed-adjustment">
        <!-- main dialog -->
        <v-dialog v-model="isOpen" width="850" scrollable>
            <v-card>
                <v-card-title class="d-flex flex-row justify-content-between mb-5">
                    <h4 class="mb-0 pb-0">
                        Adjustment Bibit
                    </h4>


                </v-card-title>
                <v-card-text class="pt-5">
                    <div class="seed-adjustment-trees d-flex flex-col" v-if="Array.isArray(tree_adjustments)">
                        <h3 class="mb-2">Jumlah bibit saat ini</h3>
                        <div class="tree-list">
                            <div class="tree-item" v-for="(item, i) in tree_adjustments" :key="`addjust-seed-${i}`">
                                <v-icon>mdi-tree</v-icon>
                                <div class="d-flex flex-col pl-3">
                                    <span class="label">{{ item.trees_tree_name }}</span>
                                    <span class="value">{{ item.amount | parse('ts') }}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="seed-adjustment-trees" v-if="Array.isArray(tree_adjustments)">
                        <h3 class="mb-2 mt-3">Jumlah Bibit</h3>

                        <div class="tree-list">
                            <div class="tree-item" v-for="(item, i) in tree_adjustments" :key="`addjust-seed-1-${i}`">
                                <v-icon>mdi-tree</v-icon>
                                <div class="d-flex flex-col pl-3 adjustment-wrapper">
                                    <geko-input v-model="item.adjustment_amount" :item="{
                                        type: 'number',
                                        label: `Pohon ${item.trees_tree_name}`,
                                    }" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="d-flex flex-row justify-content-center mt-6">
                        <v-btn variant="warning" @click="onAdjustment">
                            <span>Sesuaikan Bibit</span>
                        </v-btn>
                    </div>
                </v-card-text>
            </v-card>
        </v-dialog>
        <!-- revision dialog -->
    </div>
</template>

<script>
export default {
    name: "SeedAdjustment",

    props: {
        trees: {
            required: true,
        },
        modalKey: {
            type: Number,
            default: 0,
            required: true,
        },
    },

    methods: {
        onOpen() {
            if (this.trees && Array.isArray(this.trees.data)) {
                let totalMpts = 0;
                let totalKayu = 0;

                for (const tree of this.trees.data) {
                    if (tree.tree_category === 'Pohon_Kayu') {
                        totalKayu += parseInt(tree.amount)
                    }

                    else if (tree.tree_category == 'Pohon_Buah') {
                        totalMpts += parseInt(tree.amount)
                    }
                    tree.adjustment_amount = parseInt(tree.amount);
                }

                this.max_mpts = totalMpts
                this.max_kayu = totalKayu
                this.tree_adjustments = this.trees.data
            }
            this.isOpen = true;


        },
        onAdjustment() {

            this.loading = true
            try {
                let totalKayu = 0;
                let totalMpts = 0;

                for (const tree of this.tree_adjustments) {
                    if (tree.tree_category == 'Pohon_Kayu') {
                        totalKayu += parseInt(tree.adjustment_amount)
                    }
                    else if (tree.tree_category == 'Pohon_Buah') {
                        totalMpts += parseInt(tree.adjustment_amount)
                    }
                }

                if (totalKayu > this.max_kayu) {
                    throw `Maksimal jumlah bibit kayu adalah ${this.max_kayu}`
                }
                if (totalMpts > this.max_mpts) {
                    throw `Maksimal jumlah bibit mpts adalah ${this.max_mpts}`
                }

                const seedAdjustmentResult = JSON.parse(JSON.stringify(this.tree_adjustments))

                for (const tree of seedAdjustmentResult) {
                    tree.amount = parseInt(tree.adjustment_amount)
                }

                this.$_api.post(`lahan/seed-adjustment-carbon`, {
                    seeds: seedAdjustmentResult
                })
                    .then(() => {
                        this.$_alert.success('Data bibit berhasil diperbarui')
                        this.loading = false
                        this.isOpen = false
                        this.$parent.getData();
                    })




            }
            catch (err) {
                let errMessage = typeof err === 'string' ? err : JSON.stringify(err)
                this.$_alert.error(errMessage)
                this.loading = false
            }
        }
    },

    mounted() { },

    data() {
        return {
            isOpen: false,
            data: [],
            loading: false,
            max_mpts: 0,
            max_kayu: 0,
            tree_adjustments: []
        };
    },

    watch: {
        modalKey(t) {
            if (t > 0) {
                this.onOpen();
            }
            else {
                this.data = []
                this.tree_adjustments = []
                this.max_kayu = 0;
                this.max_mpts = 0;
            }
        },
        isOpen(t) {
            if (t) {
                this.isOpen = true;
            } else {
                this.isOpen = false;
            }
        },
    },
};
</script>

<style scoped></style>