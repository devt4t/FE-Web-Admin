<template>
    <v-dialog
        v-model="showDialog" 
        max-width="1000"
        content-class="rounded-xl"
        scrollable
    >
        <v-card>
            <v-card-title>
                <p class="mb-0"><v-icon>mdi-</v-icon> Form Request</p>
            </v-card-title>
            <v-card-text>
                asdasd
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    props: {
        show: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        showDialog: {
            get: function () {
                return this.show
            },
            set: function (val) {
                if (val == false) this.$emit('close', 'create')
            }
        }
    }
}
</script>