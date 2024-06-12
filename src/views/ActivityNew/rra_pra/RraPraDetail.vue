<template>

    <v-row class="rra-pra-detail">
        <v-col md="4" xl="3">
            <v-card data-aos="fade-up" data-aos-delay="100" data-aos-duration="800" class="rra-pra-detail-card mb-5">

                <v-card-title>
                    <v-icon large class="mr-2" @click="$router.go(-1)">mdi-arrow-left-circle</v-icon>
                    <h5 class="mb-0 pb-0">Detail RRA-PRA</h5>
                </v-card-title>
                <div class="rra-pra-wrapper">
                    <div class="rra-pra-list">
                        <div class="rra-pra-item" v-for="(f, i) in config.main_detail" :key="`main-data-${i}`">
                            <div class="label">{{ f[0] }}</div>
                            <div class="value">
                                <span v-if="f[1] === 'status'" :class="{
                                    'badge bg-light': data.rra.mainRra && !data.pra.mainPra,
                                    'badge bg-warning': data.rra.mainRra && data.rra.mainRra.status == 'document_saving',
                                    'badge bg-success': data.rra.mainRra && data.rra.mainRra.status == 'submit_review',
                                }">
                                    <span v-if="data.rra.mainRra && !data.pra.mainPra">Draft</span>
                                    <span
                                        v-else-if="data.rra.mainRra && data.rra.mainRra.status == 'document_saving'">Pending</span>
                                    <span
                                        v-else-if="data.rra.mainRra && data.rra.mainRra.status == 'submit_review'">Terverifikasi</span>
                                </span>
                                <span v-else :class="{
                                    [f.length > 4 ? f[4] : '']: true
                                }">{{ getValue(f[1]) | parse(f.length > 2 ? f[2] : 'no-empty')
                                    }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </v-card>
        </v-col>

        <v-col md="8" xl="9">
            <v-card data-aos="fade-up" data-aos-delay="100" data-aos-duration="800" class="rra-pra-detail-card mb-5">
                <div class="segment-menu">
                    <button>
                        RRA
                    </button>
                    <button class="active">
                        PRA
                    </button>
                </div>
                <v-card-title>
                    <h5 class="mb-0 pb-0">RRA</h5>
                </v-card-title>
            </v-card>

        </v-col>
    </v-row>
</template>


<script>
export default {
    name: 'rra-pra-detail',

    methods: {
        async getData() {
            const result = await this.$_api.get('GetDetailRraPra_new', { id: this.$route.query.id }).catch(() => false)
            // console.log('result', result)
            if (result) {
                this.data = result
            }
        },

        getValue(key) {
            const keys = key.split('.')

            var values = this.data
            for (const _key of keys) {
                if (values[_key]) {
                    values = values[_key]
                }
            }

            return values
        }
    },

    mounted() {
        this.getData()
    },
    data() {
        return {
            data: {},
            ready: false,
            loading: true,
            config: {
                main_detail: [
                    ['Scooping Visit', 'mainScooping.data_no'],
                    ['Status', 'status'],
                    ['RRA', 'rra.mainRra.rra_no', '', 'badge', 'badge bg-primary'],
                    ['PRA', 'pra.mainPra.pra_no', '', 'badge', 'badge bg-primary'],
                    ['Tanggal Mulai', 'rra.mainRra.rra_pra_date_start', 'date'],
                    ['Tanggal Selesai', 'rra.mainRra.rra_pra_date_end', 'date'],
                ]
            }
        }
    },
}
</script>