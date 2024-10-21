<template>
    <geko-base-crud :config="config" :refreshKey="refreshKey" :hideDetail="true" :hideUpdate="true">

        <template v-slot:list-bottom-action="{ item }">
            <v-btn variant="success" small class="mt-2" @click="onVerif(item)">
                <v-icon small>mdi-check-bold</v-icon>
                <span>Verifikasi</span>
            </v-btn>
        </template>
        <template v-slot:list-expanded-item="{ headers, item }">
            <planting-soc-list-ff :item="item" :headers="headers"></planting-soc-list-ff>
        </template>

        <template v-slot:create-form>
            <planting-soc-form></planting-soc-form>
        </template>

    </geko-base-crud>
</template>

<script>
import config from './PlantingSocConfig.js'
import PlantingSocListFf from './PlantingSocListFF.vue'
import PlantingSocForm from './PlantingSocForm.vue'

import "./planting-soc.scss";
export default {
    name: "crud-planting-socialization",
    components: {
        PlantingSocListFf,
        PlantingSocForm
    },
    watch: {},
    methods: {
        async onVerif(item) {
            const prompt = await this.$_alert.confirm('Verifikasi Data Sostam?', 'Apakah anda yakin akan memverifikasi data sostam ini?', 'Ya, Verifikasi', 'Batal', true)

            if (prompt.isConfirmed) {
                this.$_api.post('ValidateSosisalisasiTanam', {
                    soc_no: item.soc_no,
                    validate_by: this.$store.state.User.employee_no
                })
                    .then(() => {
                        this.$_alert.success('Sostam berhasil diverifikasi')
                        this.$refreshKey += 1
                    })

            }
        }
    },
    data() {
        return config
    },
};
</script>