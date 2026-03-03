<template>
    <v-dialog v-model="isOpen" width="70%">
        <v-card>
            <v-card-title>
                <span>Populate </span>
            </v-card-title>

            <v-card-text class="farmer-assign-wrapper mt-3">
                <div>
                    <h1>hello</h1>
                </div>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    props: {
        dataKey: {
            type: Number,
            default: 0,
        },
    },
    data() {
        return {
            isOpen: false,
        };
    },
    watch: {
        dataKey() {
            this.isOpen = true;
        },
    },
};
</script>