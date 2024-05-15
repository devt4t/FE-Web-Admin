<template>
    <div class="geko-base-crud">
        <v-breadcrumbs :dark="$store.state.theme == 'dark'" class="breadcrumbsmain" :items="[
            {
                text: 'Utilities',
                disabled: true,
                href: 'breadcrumbs_dashboard',
            },
            {
                text: 'Planting Environment',
                disabled: true,
                href: 'breadcrumbs_link_1',
            },
        ]" divider=">" large data-aos="fade-right"></v-breadcrumbs>

        <div class="geko-list" v-if="activeView === 'list'">
            <v-data-table :headers="header" :items="data" :search="''" class="rounded-xl elevation-6 mx-3 pa-1"
                data-aos="fade-up" data-aos-delay="200" @update:page="($p) => (page = $p)"
                @update:items-per-page="($p) => (perPage = $p)" :items-per-page="perPage"
                :server-items-length="totalRecord" :page="page" :footer-props="{
                    itemsPerPageText: 'Jumlah Data Per Halaman',
                    itemsPerPageOptions: [10, 25, 50, 100, 200],
                    showCurrentPage: true,
                    showFirstLastPage: true,
                }">
                <template v-slot:top>
                    <div class="geko-list-header px-5 py-3 mt-1">
                        <div>
                            <h4>{{ config.title }}</h4>
                        </div>
                        <v-btn variant="success" @click="$router.push({
                            query: {
                                view: 'create'
                            }
                        })">
                            <v-icon small>mdi-plus</v-icon>
                            <span class="ms-2">Tambah Data</span>
                        </v-btn>
                    </div>
                </template>
                <template v-slot:item.index="{ index }">
                    {{ index + 1 }}
                </template>

                <template v-slot:item.actions="{ item }">
                    <div class="geko-list-actions">
                        <button class="geko-list-action-view" v-b-tooltip.hover title="Detail">
                            <v-icon small>mdi-eye-outline</v-icon>
                        </button>
                        <button class="geko-list-action-update" v-b-tooltip.hover title="Perbarui">
                            <v-icon small>mdi-pencil-minus</v-icon>
                        </button>
                        <button class="geko-list-action-delete" v-b-tooltip.hover title="Hapus">
                            <v-icon small>mdi-trash-can-outline</v-icon>
                        </button>
                    </div>
                </template>
            </v-data-table>
        </div>

        <div class="geko-form mx-4" v-if="activeView === 'create'">
            <geko-base-form :title="config.title" :fields="fields.create" />
        </div>
    </div>
</template>

<script>
import "../assets/scss/geko-base-crud.scss";
import GekoBaseForm from './GekoBaseForm.vue'
export default {
    name: "geko-base-crud",
    props: {
        config: {
            type: Object,
            required: true,
            default: {},
        },
        hideCreate: {
            type: Boolean,
            required: false,
            default() {
                return false;
            },
        },
        hideDetail: {
            type: Boolean,
            required: false,
            default() {
                return false;
            },
        },
        hideDelete: {
            type: Boolean,
            required: false,
            default() {
                return false;
            },
        },
        hideUpdate: {
            type: Boolean,
            required: false,
            default() {
                return false;
            },
        },
    },
    components: {
        GekoBaseForm
    },
    data() {
        return {
            header: [],
            data: [],
            params: {},
            filters: {},
            endpoint: {},
            page: 1,
            perPage: 10,
            activeView: "list",
            activeID: null,
            permission: {},
            loading: true,
            totalRecord: null,

            fields: {
                list: [],
                detail: [],
                create: [],
                update: [],
                filter: [],
            },
        };
    },

    mounted() {
        this.onInit();
    },

    methods: {
        async onInit() {
            await this.buildModule();
            await this.generateList();
            this.getListData();
        },
        buildModule() {
            return new Promise(async (resolve) => {
                if (!this.config) return resolve();

                if (!Array.isArray(this.config.fields)) return resolve();

                let _fields = {
                    list: [],
                    detail: [],
                    create: [],
                    update: [],
                    filter: [],
                };

                for (const f of this.config.fields) {
                    if (f.methods.list) {
                        if (f.methods.list.show === false) continue;
                        _fields.list.push(this.generateConfigField(f, "list"));
                    }
                    if (f.methods.detail) {
                        if (f.methods.detail.show === false) continue;
                        _fields.detail.push(this.generateConfigField(f, "detail"));
                    }
                    if (f.methods.create) {
                        if (f.methods.create.show === false) continue;
                        _fields.create.push(this.generateConfigField(f, "create"));
                    }
                    if (f.methods.update) {
                        if (f.methods.update.show === false) continue;
                        _fields.update.push(this.generateConfigField(f, "update"));
                    }
                    if (f.methods.filter) {
                        if (f.methods.filter.show === false) continue;
                        _fields.filter.push(this.generateConfigField(f, "filter"));
                    }
                }

                this.fields = _fields;
                return resolve();
            });
        },

        generateList() {
            return new Promise(async (resolve) => {
                let _header = [];

                if (this.config.listOption && this.config.listOption.noIndex) {
                } else {
                    _header.push({
                        text: "#",
                        value: "index",
                        key: "index",
                    });
                }
                for (const f of this.fields.list) {
                    _header.push({
                        text: f.label,
                        key: f.view_data,
                        class: f.class,
                        value: f.view_data,
                    });
                }

                _header.push({
                    text: "",
                    key: "actions",
                    value: "actions",
                    class: "floating-column",
                });

                this.header = _header;

                if (typeof this.config.filter_api === "object") {
                    this.filters = JSON.parse(JSON.stringify(this.config.filter_api));
                }

                return resolve();
            });
        },

        generateConfigField(item, key) {
            let _data = {
                view_data: item.methods[key].view_data || item.id,
                label: item.label || item.id,
                header_class: item.methods[key].header_class || null,
                type: item.methods[key].type || "text",
                class: item.methods[key].class || null,
                transform: item.methods[key].transform || null,
                validation: item.methods[key].validation || [],
                input: typeof item.methods[key].input === 'boolean' ? item.methods[key].input : true
            };
            if (key === 'create' && item.label == 'Created By') {
                console.log(item.methods[key].input);
            }

            return _data;
        },

        async getListData() {
            let _params = JSON.parse(JSON.stringify(this.params));
            let _filters = JSON.parse(JSON.stringify(this.filters));
            let reqParams = Object.assign(_filters, _params);
            const responseData = await this.$_api.get(this.config.getter, reqParams);
            this.data = responseData.data;
            console.log(responseData.total);
            this.totalRecord = responseData.total;
        },
    },

    watch: {
        $route: {
            deep: true,
            immediate: true,
            handler(to) {
                this.activeView = to.query.view ? to.query.view : "list";

                this.activeID = to.query.id
                    ? isNaN(to.query.id)
                        ? to.query.id
                        : Number(to.query.id)
                    : "";
            },
        },
    },
};
</script>
