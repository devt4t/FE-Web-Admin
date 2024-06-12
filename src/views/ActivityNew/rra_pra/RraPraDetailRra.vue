<template>
    <div class="rra-detail" v-if="data">
        <rra-pra-detail-card v-if="configs[activeMenu].mainData" :data="data[configs[activeMenu].getter]"
            :scoopingData="scoopingData" :config="configs[activeMenu].fields" />
        <rra-pra-detail-table v-if="!configs[activeMenu].mainData" :config="configs[activeMenu]"
            :data="data[configs[activeMenu].getter]" wc="mt-5" />

    </div>
</template>

<script>

import RraPraDetailTable from './RraPraDetailTable.vue'
import RraPraDetailCard from './RraPraDetailCard.vue'
export default {
    name: 'rra-pra-detail-rra',
    components: {
        RraPraDetailTable,
        RraPraDetailCard
    },
    props: {
        data: {
            required: false,
            default: null,

        },
        scoopingData: {
            required: false,
            default: null
        },
        activeMenu: {
            required: false,
            default: 0
        }
    },

    methods: {


        getValue(key) {
            const keys = key.split('.')

            var values = this.data
            for (const _key of keys) {
                if (values[_key]) {
                    values = values[_key]
                }
            }

            return values;
        },
        initData() {
            const keys = [{
                getter: 'RraVillageBorder',
                setter: 'village_borders'
            }]

            for (const _key of keys) {
                if (this.data[_key.getter]) {
                    if (typeof this.data[_key.getter] === 'object' && !Array.isArray(this.data[_key.getter])) {
                        this[_key.setter] = [this.data[_key.getter]]
                    }

                    else if (Array.isArray(this.data[_key.getter])) {
                        this[_key.setter] = this.data[_key.getter]
                    }

                    else {
                        this[_key.setter] = []
                    }
                }
            }
        }
    },
    data() {
        return {
            village_borders: [],
            configs: [
                {
                    title: 'Landscape Desa',
                    getter: 'mainRra',
                    mainData: true,
                    fields: [
                        {
                            label: "Luas Desa",
                            getter: 'scoopingData.land_area',
                            transform: 'ts'
                        },
                        {
                            label: "Tanah Sawah",
                            getter: 'data.tanah_sawah',
                            transform: 'ts'
                        },
                        {
                            label: "Tegal / Ladang",
                            getter: 'data.tegal_ladang',
                            transform: 'ts'
                        },
                        {
                            label: "Pemukiman",
                            getter: 'data.pemukiman',
                            transform: 'ts'
                        },
                        {
                            label: "Pekarangan",
                            getter: 'data.pekarangan',
                            transform: 'ts'
                        },
                        {
                            label: "Tanah Rawa",
                            getter: 'data.tanah_rawa',
                            transform: 'ts'
                        },
                        {
                            label: "Situ / Waduk / Danau",
                            getter: 'data.waduk_danau',
                            transform: 'ts'
                        },
                        {
                            label: "Tanah Perkebunan Rakyat",
                            getter: 'data.tanah_perkebunan_rakyat',
                            transform: 'ts'
                        },
                        {
                            label: "Tanah Perkebunan Negara",
                            getter: 'data.tanah_perkebunan_negara',
                            transform: 'ts'
                        },
                        {
                            label: "Tanah Perkebunan Swasta",
                            getter: 'data.tanah_perkebunan_swasta',
                            transform: 'ts'
                        },
                        {
                            label: "Hutan Lindung",
                            getter: 'data.hutan_lindung',
                            transform: 'ts'
                        },
                        {
                            label: "Hutan Rakyat",
                            getter: 'data.hutan_rakyat',
                            transform: 'ts'
                        },
                        {
                            label: "Fasilitas Umum",
                            getter: 'data.fasilitas_umum',
                            transform: 'ts'
                        },
                    ]
                },
                {
                    title: 'Batas Wilayah',
                    getter: 'RraVillageBorder',
                    fields: [
                        {
                            getter: 'point',
                            label: 'Batas',
                            transform: 'border',
                            class: 'badge bg-primary'
                        },
                        {
                            label: 'Kabupaten',
                            getter: 'kabupatens_name',
                            class: 'text-capitalize',
                            // transform: 'lowercase'
                        },
                        {
                            label: 'Kecamatan',
                            getter: 'kecamatans_name',
                            class: 'text-capitalize',
                            // transform: 'lowercase'
                        },
                        {
                            label: 'Desa',
                            getter: 'desas_name',
                            class: 'text-capitalize',
                            // transform: 'lowercase'
                        },
                    ]
                },
                {
                    title: 'Pola Pemanfaatan Lahan',
                    getter: 'RralandUse',
                    fields: [
                        {
                            getter: 'pattern',
                            label: 'Pola',
                            translate: 'land_use_pattern'
                        },
                        {
                            getter: 'plant',
                            label: 'Tanaman',
                        },
                    ]
                },
                {
                    title: 'Kelembagaan Masyarakat',
                    getter: 'RraComunityInstitution',
                    fields: [
                        {
                            getter: 'institution_name',
                            label: 'Nama Lembaga',
                        },
                        {
                            getter: 'role',
                            label: 'Peran',
                            class: 'd-block text-left text-09-em'
                        },
                        {
                            getter: 'description',
                            label: 'Deskripsi',
                            class: 'd-block text-left text-09-em'
                        },
                    ]
                },
                {
                    title: 'Potensi Pertanian Organik',
                    getter: 'OrganicPotential',
                    fields: [
                        {
                            getter: 'name',
                            label: 'Nama',
                        },
                        {
                            getter: 'capacity',
                            label: 'Capacity',
                        },
                        {
                            getter: 'method',
                            label: 'Metoe',
                        },
                        {
                            getter: 'marketing_period',
                            label: 'Periode Pemasaran',
                        },
                    ]
                },
            ],
            mainConfig: [],

        }
    },
    watch: {
        data(v) {
            if (v && v !== null) {
                this.initData();
            }
        },
    }
}
</script>