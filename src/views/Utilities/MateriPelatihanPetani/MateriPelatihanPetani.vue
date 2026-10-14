<template>
    <geko-base-crud :config="config" :hideDelete="false" :hideUpdate="false" :hideCreate="false"
        :refreshKey="refreshKey++">
        <template v-slot:list-indicator="{ item }">
        </template>
    </geko-base-crud>
</template>

<script>
import config from './MateriPelatihanPetaniConfig.js';

export default {
    data() {
        return {
            refreshKey: 0,
            config,
        }
    },
    // methods: {

    // },
}
</script>