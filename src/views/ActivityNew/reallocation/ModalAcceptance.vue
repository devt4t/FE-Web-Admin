<template>
    <v-dialog v-model="isOpen" width="90%">
        <template v-slot:default="{ isActive }">
            <v-card>
                <v-card-title>
                    <span>Form Penerimaan Bibit Tambahan</span>
                </v-card-title>

                <v-card-text class="farmer-assign-wrapper mt-3">
                    <ValidationObserver ref="firstForm" v-slot="{ handleSubmit }">
                        <form @submit.prevent="handleSubmit(onSubmit)" autocomplete="off">

                            <v-data-table :loading="loading" :headers="headerAddendumTable" :items="reallocationList"
                                :search="search" class="rounded-xl px-1 pt-2" :items-per-page="perPage"
                                @update:items-per-page="($p) => (perPage = $p)" :footer-props="{
                                    itemsPerPageOptions: [5, 10, 25, 50, 100, 200],
                                    showCurrentPage: true,
                                    showFirstLastPage: true,
                                }">

                                <template v-slot:top>
                                    <div class="list-header py-3 mt-1">
                                        <div class="pr-5 mr-5 d-flex flex-row" style="justify-content: space-between">
                                            <div></div>
                                            <geko-input v-model="search" :item="{
                                                label: 'Cari Bibit / Lahan',
                                                type: 'text'
                                            }" />
                                        </div>
                                    </div>
                                </template>

                                <template v-slot:item.index="{ index }">
                                    {{ index + 1 }}
                                </template>
                                <template v-slot:item.received="{ item }">
                                    <geko-input
                                        v-model="formData[item.farmer_no + '-' + item.lahan_no + '-' + item.rel_tree_id].received"
                                        :item="{
                                            type: 'number',
                                        }" />
                                </template>
                                <template v-slot:item.damaged="{ item }">
                                    <geko-input
                                        v-model="formData[item.farmer_no + '-' + item.lahan_no + '-' + item.rel_tree_id].damaged"
                                        :item="{
                                            type: 'number',
                                        }" />
                                </template>
                                <template v-slot:item.missing="{ item }">
                                    <geko-input
                                        v-model="formData[item.farmer_no + '-' + item.lahan_no + '-' + item.rel_tree_id].missing"
                                        :item="{
                                            type: 'number',
                                        }" />
                                </template>

                            </v-data-table>
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
            loading: false,
            search: '',
            muNo: null,
            isOpen: false,
            loading: false,
            perPage: 200,
            total: 0,
            page: 1,
            selectedFarmer: null,
            formData: {},
            reallocationList: [],
            headerAddendumTable: [
                {
                    key: "index",
                    sortable: false,
                    text: "No",
                    value: "index",
                },
                {
                    key: "lahan_no",
                    value: "lahan_no",
                    text: "Nomor Lahan",
                },
                {
                    key: "rel_tree_id",
                    value: "rel_tree_id",
                    text: "Nama Bibit",
                },
                {
                    key: "after_qty_seed",
                    value: "after_qty_seed",
                    text: "Total Load",
                },

                {
                    key: "description_reason",
                    value: "description_reason",
                    text: "Keterangan",
                },
                {
                    key: "farmer_name",
                    value: "farmer_name",
                    text: "Nama Petani",
                },
                {
                    key: "farmer_no",
                    value: "farmer_no",
                    text: "Kode Petani",
                },
                {
                    key: "received",
                    value: "received",
                    text: "Diterima"
                },
                {
                    key: "damaged",
                    value: "damaged",
                    text: "Rusak"
                },
                {
                    key: "missing",
                    value: "missing",
                    text: "Hilang"
                }

                // {
                //   key: "id",
                //   value: "id",
                //   text: "",
                // },
                // {
                //   key: "tree_id",
                //   value: "tree_id",
                //   text: "",
                // },
                // {
                //   key: "updated_at",
                //   value: "updated_at",
                //   text: "",
                // },
                // {
                //   key: "updated_by",
                //   value: "updated_by",
                //   text: "",
                // },
                // {
                //   key: "rel_adendum_id",
                //   value: "rel_adendum_id",
                //   text: "",
                // },
                // {
                //   key: "rel_created_by",
                //   value: "rel_created_by",
                //   text: "",
                // },
                // {
                //   key: "before_qty_seed",
                //   value: "before_qty_seed",
                //   text: "",
                // },
                // {
                //   key: "category_id",
                //   value: "category_id",
                //   text: "",
                // },
                // {
                //   key: "created_at",
                //   value: "created_at",
                //   text: "",
                // },
                // {
                //   key: "created_by",
                //   value: "created_by",
                //   text: "",
                // },
                // {
                //   key: "rel_updated_by",
                //   value: "rel_updated_by",
                //   text: "",
                // },
            ]
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

            if (!item.status_allocation) {
                this.$_alert.error("Bibit belum dialokasi");
                return;
            }

            let params = [];
            for (const adendum of this.reallocationList) {

                if (!adendum.detail_seed_farmer.length) {
                    this.$_alert.error("Bibit belum dimuat di persemaian");
                    return;
                }

                params.push({
                    detail_seed_farmer_id: String(adendum.detail_seed_farmer[0].detail_seed_farmer_id),
                    lahan_no: adendum.lahan_no,
                    tree_id: String(adendum.tree_id),
                    total_load: adendum.after_qty_seed,
                    total_received: this.formData[adendum.farmer_no + '-' + adendum.lahan_no + '-' + adendum.rel_tree_id].received,
                    total_damaged: this.formData[adendum.farmer_no + '-' + adendum.lahan_no + '-' + adendum.rel_tree_id].damaged,
                    total_missing: this.formData[adendum.farmer_no + '-' + adendum.lahan_no + '-' + adendum.rel_tree_id].missing,
                });
            }

            this.$_api
                .post("nursery/reallocation/acceptance", {
                    seeds: params
                })
                .then((res) => {
                    if (res.message != 'success') {
                        this.$_alert.error(res.message);
                        return;
                    }

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
            this.loading = true;
            const url = "nursery/addendum/reallocation/list";
            let params = {
                addendum_id: this.data.id,
                limit: 200,
                offset: this.page == 1 ? 0 : this.page == 2 ? this.perPage : this.perPage * (this.page - 1)
            };
            const allocationLists = await this.$_api.get(url, params);

            this.reallocationList = allocationLists.data;
            this.total = allocationLists.total;

            this.loading = false;

            this.generateFormDataObject();

        },
        generateFormDataObject() {
            let formData = new Object();
            for (const allocation of this.reallocationList) {
                formData[allocation.farmer_no + '-' + allocation.lahan_no + '-' + allocation.rel_tree_id] = {};
                formData[allocation.farmer_no + '-' + allocation.lahan_no + '-' + allocation.rel_tree_id].received = allocation.after_qty_seed;
                formData[allocation.farmer_no + '-' + allocation.lahan_no + '-' + allocation.rel_tree_id].damaged = '0';
                formData[allocation.farmer_no + '-' + allocation.lahan_no + '-' + allocation.rel_tree_id].missing = '0';
            }

            this.formData = formData
        },
        onChangePage(page) {
            this.page = page;
            this.getReallocationList();
        }

    },

    mounted() {
        // this.getReallocationList();
    },
};
</script>