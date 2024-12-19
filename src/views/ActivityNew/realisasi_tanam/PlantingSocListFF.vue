<template>

    <td :colspan="headers.length" class="py-4" style="background-color: #fafafa;">
        <v-data-table :loading="loading" :headers="dataHeaders" :items="data" :items-per-page="100"
            class="elevation-1 rounded-xl mx-3 pa-1" style="background-color:#fafafa;" data-aos="fade-up"
            data-aos-delay="100" data-aos-duration="800">
            <template v-slot:item.index="{ index }">
                {{ index + 1 }}
            </template>

            <template v-slot:item.action="{ item }">
                <div class="d-flex flex-column flex-col">
                    <v-btn variant="warning" small @click="$emit('edit', item)">
                        <v-icon>mdi-pencil</v-icon>
                        <span>Perbarui</span>
                    </v-btn>
                </div>
            </template>

            <template v-slot:item.status="{ item }">
                <div class="d-flex flex-column align-items-center min-w-150px">
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
                <span class="font-weight-bold d-block min-w-150px" v-if="item.lahan_datas">
                    {{ item.lahan_datas.luas_lahan_gis ? item.lahan_datas.luas_lahan_gis : item.lahan_datas.luas_lahan
                    }} m2
                </span>
            </template>

            <template v-slot:item.coordinate="{ item }">
                {{ item.lahan_datas?.koordinat_lahan }}
            </template>

            <template v-slot:item.opsi_pola_tanam="{ item }">
                {{ item.lahan_datas?.opsi_pola_tanam }}
            </template>

            <template v-slot:item.farmer_signature="{ item }">
                <div class="d-flex flex-row justify-content-center">
                    <span class="badge" :class="{
                        'bg-success': item.signature,
                        'bg-warning': !item.signature
                    }">{{ item.signature ? 'Sudah' : 'Belum' }}</span>
                </div>
            </template>

            <template v-slot:item.attendance="{ item }">
                <div class="d-flex flex-row min-w-100px">
                    <span class="badge" :class="{
                        'bg-success': item.attendance,
                        'bg-danger': !item.attendance
                    }">{{ item.attendance ? 'Hadir' : 'Tidak Hadir' }}</span>
                </div>
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
                    text: '#',
                    value: 'action'
                },
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
                    value: 'total_bibits',
                    class: 'font-weight-bold'
                },
                {
                    text: 'Tahun Tanam',
                    value: 'planting_year'
                },
                {
                    text: 'Attendance',
                    value: 'attendance'
                },
                {
                    text: 'Tanda Tangan Petani',
                    value: 'farmer_signature'
                },
                {
                    text: 'Status',
                    value: 'status'
                },
                // {
                //     text: 'Status Adjustment',
                //     value: 'adjustment_validation'
                // },
            ],
            data: [],
            loading: true
        }
    },

    watch: {
        item: {
            deep: true,
            handler(t) {
                this.data = []
                this.getData()
            }
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