<template>
    <!-- Try Cam360 -->
    <v-card class="rounded-xl mt-3" data-aos="fade-up" >
        <v-card-title>
            <v-icon class="mr-1">mdi-panorama-variant</v-icon>
            <v-badge content="Develop" color="warning">360<sup>o</sup> View</v-badge>
            <v-divider class="mx-2"></v-divider>
            <v-autocomplete
                dense
                color="success"
                hide-details
                item-color="success"
                class="ml-2"
                :items="select_source.items"
                :label="select_source.label"
                :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                outlined
                rounded
                v-model="select_source.model"
                style="max-width: 300px;"
            ></v-autocomplete>
        </v-card-title>
        <v-card-text>
            <div style="width: 100%;height: 400px;resize: vertical;overflow: hidden;min-height: 300px;max-height: 80vh;">
                <iframe class="ku-embed rounded-xl" style="width: 100%;height: 100%;" frameborder="0" allow="xr-spatial-tracking; gyroscope; accelerometer" allowfullscreen scrolling="no" :src="`https://kuula.co/share/${select_source.model}?logo=1&info=1&fs=1&vr=0&zoom=1&sd=1&initload=0&thumbs=1`"></iframe>
            </div>
        </v-card-text>
    </v-card>
</template>

<script>
export default {
    data: () => ({
        select_source: {
            items: [],
            label: 'Data View',
            model: 'Nwzyt',
        },
    }),
    methods: {
        async setSourceData() {
            this.select_source.items = [
                {
                    text: 'Persemaian Arjasari (2022)',
                    value: 'NwzTQ'
                },
                {
                    text: 'Persemaian Ciminyak',
                    value: 'Nwzyt'
                },
            ]
        }
    },
    async mounted() {
        await this.setSourceData()
    }
}
</script>