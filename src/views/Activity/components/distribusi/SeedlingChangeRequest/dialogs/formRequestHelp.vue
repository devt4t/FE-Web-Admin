<template>
    <v-dialog v-model="showDialog" max-width="500" content-class="rounded-xl">  
        <v-card>
            <v-card-title>Form Change Request Instruction</v-card-title>
            <v-card-text>
                HELP!!!
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
        },
    },
    data: () => ({}),
    computed: {
        showDialog: {
            get: function () {
                return this.show
            },
            set: async function (val) {
                if (val == false) {
                    this.$emit('close')
                } 
            }
        },
    }
}
</script>