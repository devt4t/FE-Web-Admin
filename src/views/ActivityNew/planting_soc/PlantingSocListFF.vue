<template>

    <td :colspan="headers.length" class="py-4" style="background-color: #fafafa;">
        <v-data-table :loading="loading" :headers="dataHeaders" :items="data" :items-per-page="100"
            class="elevation-1 rounded-xl mx-3 pa-1" style="background-color:#fafafa;" data-aos="fade-up"
            data-aos-delay="100" data-aos-duration="800">
            <template v-slot:item.index="{ index }">
                {{ index + 1 }}
            </template>

            <template v-slot:item.status="{ item }">
                <div class="d-flex flex-column align-items-center">
                    <span class="badge" :class="{
                        'bg-warning': item.validation == 0,
                        'bg-success': item.validation == 1
                    }">{{ item.validation == 0 ? 'Belum Diverifikasi' : 'Diverifikasi FC' }}</span>
                </div>
            </template>

            <template v-slot:item.adjustment_validation="{ item }">
                <div class="d-flex flex-column align-items-center">
                    <span class="badge" :class="{
                        'bg-warning': item.adjustment_validation == 0,
                        'bg-success': item.adjustment_validation == 1
                    }">{{ item.adjustment_validation == 0 ? 'Belum Diverifikasi' : 'Diverifikasi FC' }}</span>
                </div>
            </template>

            <template v-slot:item.land_area="{ item }">
                {{ item.lahan_datas?.land_area }}
            </template>

            <template v-slot:item.coordinate="{ item }">
                {{ item.lahan_datas?.koordinat_lahan }}
            </template>

            <template v-slot:item.opsi_pola_tanam="{ item }">
                {{ item.lahan_datas?.opsi_pola_tanam }}
            </template>
        </v-data-table>
    </td>
</template>

<script>
export default {
    name: 'planting-soc-list-ff',
    methods: {
        async getData() {
            const result = await this.$_api.get('GetSosisalisasiTanamAdmin', {
                program_year: this.item.program_year,
                page: 1,
                per_page: 1000,
                limit: 1000,
                typegetdata: 'all',
                ff_no: this.item.ff_no
            })
            this.data = result.data
            this.loading = false

        }
    },
    mounted() {
        this.getData()
    },
    data() {
        return {
            dataHeaders: [
                {
                    text: 'No',
                    value: 'index',
                },
                {
                    text: 'No. Form',
                    value: 'form_no',
                },
                {
                    text: 'Nama FF',
                    value: 'field_facilitators_name',
                },
                {
                    text: 'Nama Petani',
                    value: 'farmers_name',
                },
                {
                    text: 'No Lahan',
                    value: 'no_lahan',
                },
                {
                    text: 'Luas Lahan',
                    value: 'land_area'
                },
                {
                    text: 'Koordinat',
                    value: 'coordinate'
                },
                {
                    text: 'Pola Tanam',
                    value: 'opsi_pola_tanam'
                },
                // {
                //     text: 'Waktu Tunggu Validasi',
                //     value: 'validation'
                // },
                {
                    text: 'Total Bibit',
                    value: 'max_seed_amount'
                },
                {
                    text: 'Tahun Tanam',
                    value: 'planting_year'
                },
                {
                    text: 'Status',
                    value: 'status'
                },
                // {
                //     text: 'Status Adjustment',
                //     value: 'adjustment_validation'
                // },
                {
                    text: '#',
                    value: 'action'
                }
            ],
            data: [],
            loading: true
        }
    },
    props: {
        item: {
            type: Object,
            default: null
        },
        headers: {
            type: Array,
            default: () => []
        }
    }
}
</script>