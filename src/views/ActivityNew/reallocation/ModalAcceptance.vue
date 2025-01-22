<template>
    <v-dialog v-model="isOpen" width="50%">
        <template v-slot:default="{ isActive }">
            <v-card>
                <v-card-title>
                    <span>Form Penerimaan Bibit Tambahan</span>
                </v-card-title>

                <v-card-text class="farmer-assign-wrapper mt-3">
                    <ValidationObserver ref="firstForm" v-slot="{ handleSubmit }">

                        <form @submit.prevent="handleSubmit(onSubmit)" autocomplete="off">
                            <v-row>
                                <v-col>
                                    <div style="display: inline-block; margin: 0px 10px 10px 0px"
                                        v-for="(item, key) of reallocationList">
                                        <v-btn :variant="selectedFarmer === item.farmer_no + item.rel_tree_id + item.lahan_no ? 'success' : 'light'"
                                            @click="selectedFarmer = item.farmer_no + item.rel_tree_id + item.lahan_no">
                                            {{ item.farmer_name }} - {{ item.lahan_no }} - {{ item.rel_tree_id }}

                                            <div>
                                                <v-badge v-if="formData[item.farmer_no].received != '0'"
                                                    style="display: inline-block;" small color="primary"
                                                    :content="formData[item.farmer_no].received" inline>
                                                </v-badge>
                                                <v-badge v-if="formData[item.farmer_no].damaged != '0'"
                                                    style="display: inline-block;" small color="red"
                                                    :content="formData[item.farmer_no].damaged" inline>
                                                </v-badge>
                                                <v-badge v-if="formData[item.farmer_no].missing != '0'"
                                                    style="display: inline-block;" small color="grey"
                                                    :content="formData[item.farmer_no].missing" inline>
                                                </v-badge>
                                            </div>
                                        </v-btn>
                                    </div>
                                </v-col>
                            </v-row>
                            <v-row v-if="selectedFarmer === item.farmer_no + item.rel_tree_id + item.lahan_no" v-for="(item, index) in reallocationList"
                                :key="index">
                                <v-col lg="12">
                                    <geko-input v-model="formData[item.farmer_no].received" :item="{
                                        label: 'Bibit Diterima',
                                        type: 'number',
                                        validation: ['required'],
                                    }" />
                                </v-col>
                                <v-col lg="12">
                                    <geko-input v-model="formData[item.farmer_no].damaged" :item="{
                                        label: 'Bibit Rusak',
                                        type: 'number',
                                    }" />
                                </v-col>
                                <v-col lg="12">
                                    <geko-input v-model="formData[item.farmer_no].missing" :item="{
                                        label: 'Bibit Hilang',
                                        type: 'number',
                                    }" />
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col lg="12">
                                    <v-btn class="float-right" variant="success" type="submit">
                                        <v-icon small>mdi-seed</v-icon>
                                        <span class="ml-1">Konfirmasi Diterima</span>
                                    </v-btn>
                                </v-col>
                            </v-row>
                        </form>
                    </ValidationObserver>
                </v-card-text>
            </v-card>
        </template>
    </v-dialog>
</template>

<script>
import axios from "axios";
import moment from "moment";
export default {
    name: "modal-acceptance",
    data() {
        return {
            muNo: null,
            isOpen: false,
            loading: false,
            selectedFarmer: null,
            formData: {},
            reallocationList: []
        };
    },
    props: {
        dataKey: {
            required: false,
            default: false,
        },
        data: {
            required: true,
        }
    },

    watch: {
        dataKey(t) {
            if (t > 0) {
                this.getReallocationList();
                this.isOpen = true;
            }

            if (!t) {
                this.ff_code = null;
            }
        },
    },

    methods: {
        async onSubmit() {

            const item = this.data;

            for (const [farmer_no, farmer] of Object.entries(this.formData)) {
                if (farmer.received == "0") {
                    this.$_alert.error("Semua petani harus menerima bibit");

                    return;
                }
            }

            const params = this.reallocationList.map(
                adendum => {
                    return {
                        detail_seed_farmer_id: adendum.detail_seed_farmer,
                        lahan_no: adendum.lahan_no,
                        tree_id: adendum.tree_id,
                        total_load: adendum.after_qty_seed,
                        total_received: this.formData[adendum.farmer_no].received,
                        total_damaged: this.formData[adendum.farmer_no].damaged,
                        total_missing: this.formData[adendum.farmer_no].missing,
                    }
                })


            console.log(params);
            return;

            this.$_api
                .post("nursery/reallocation/acceptance", {
                    seeds: params.flat()
                })
                .then((res) => {
                    this.isOpen = false;
                    this.$_alert.success("Bibit Telah Diterima");
                });

        },

        getExportData(offset) {
            return new Promise(async (resolve, reject) => {
                this.$_api
                    .get("sostam/export-by/mu", {
                        mu_no: this.muNo,
                        program_year: this.$store.state.tmpProgramYear,
                        limit: 10,
                        offset: offset,
                    })
                    .then((res) => {
                        return resolve(res.data);
                    })
                    .catch(() => {
                        return reject(false);
                    });
            });
        },

        async getReallocationList() {
            const url = "nursery/addendum/reallocation/list/staging";
            let params = {
                addendum_id: this.data.id
            };
            const allocationLists = await this.$_api.get(url, params);

            this.reallocationList = allocationLists.data;

            this.generateFormDataObject()
        },
        generateFormDataObject() {
            let formData = new Object();
            for (const allocation of this.reallocationList) {
                formData[allocation.farmer_no] = {};
                formData[allocation.farmer_no].received = allocation.after_qty_seed;
                formData[allocation.farmer_no].damaged = '0';
                formData[allocation.farmer_no].missing = '0';
            }

            this.formData = formData
        }

    },

    mounted() {
        // this.getReallocationList();
    },
};
</script>