<template>
    <v-row class="planting-soc-detail">
        <v-col md="12">
            <v-card data-aos="fade-up" data-aos-delay="100" data-aos-duration="800"
                class="scooping-visit-detail-card mb-5">
                <v-card-title>
                    <v-icon large class="mr-2" @click="$router.go(-1)">mdi-arrow-left-circle</v-icon>
                    <h5 class="mb-0 pb-0">Detail Sosialisasi Tanam</h5>
                </v-card-title>

                <div class="card-body" v-if="data">
                    <table class="planting-soc-table">
                        <tr>
                            <td>No Sostam</td>
                            <td>
                                <span class="text-link d-block">#{{ data.soc_no }}</span>
                                <span class="text-09-em">{{ data.soc_date | parse('date') }}</span>
                            </td>
                        </tr>
                        <tr>
                            <td>Field Facilitator</td>
                            <td>
                                <span class="font-weight-400">{{ data.field_facilitator_name }}</span>
                                <div class="d-flex flex-row">
                                    <span class="badge bg-light d-block">
                                        {{ data.ff_no }}
                                    </span>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>Unit Management</td>
                            <td>
                                <span>{{ data.management_unit_name }}</span>
                                <span class="d-block font-weight-300">{{ data.target_area_name }}</span>
                            </td>
                        </tr>
                        <tr>
                            <td>Distribusi</td>
                            <td>
                                <div class="distribution-wrapper">
                                    <div class="distribution-start">
                                        <v-icon>mdi-tanker-truck</v-icon>
                                        <span class="d-block title">Nursery Kebumen</span>
                                        <span class="d-block distribution-seed">
                                            {{ data.total_seed | parse('ts') }} bibit
                                        </span>
                                    </div>

                                    <div class="distribution-progress">
                                        <span class="line"></span>
                                    </div>

                                    <div class="distribution-end">
                                        <v-icon>mdi-truck-fast</v-icon>
                                        <span class="d-block location">{{ data.distribution_location }}</span>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </table>
                </div>
            </v-card>
        </v-col>
    </v-row>
</template>


<script>
export default {
    name: 'planting-soc-detail',
    data() {
        return {
            data: null,
            ready: false,
            loading: false,
            farmers: []
        }
    },
    mounted() {
        this.getData()
    },
    methods: {
        async getData() {
            try {
                if (this.loading) return;
                this.loading = true


                let response = await this.$_api.get('sostam/detail', {
                    soc_no: this.$route.query.soc_no,
                    program_year: this.$store.state.tmpProgramYear
                }).catch(() => false)

                if (!response) throw true

                let seedTotal = 0;
                for (const farmer of response.farmers) {
                    seedTotal += farmer.total_seed
                }

                response.data.total_seed = seedTotal
                response.data.distribution_location = response.farmers[0].distribution_location
                response.data.distribution_coordinates = response.farmers[0].distribution_coordinates
                this.farmers = response.farmers
                this.data = response.data
                this.loading = false

            }
            catch {
                this.loading = false
            }

        }
    }
}
</script>