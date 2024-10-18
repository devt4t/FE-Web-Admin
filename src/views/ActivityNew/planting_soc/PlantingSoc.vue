<template>
    <geko-base-crud :config="config" :hideAction="true">
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
    data() {
        return config
    },
};
</script>