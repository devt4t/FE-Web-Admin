<template>
    <v-dialog v-model="showDialog" content-class="rounded-xl" max-width="500">
        <v-card>
            <v-card-title class="grey--text">
                <v-spacer></v-spacer>
                <v-icon class="mr-1" color="grey">mdi-information</v-icon> Confirmation
                <v-spacer></v-spacer>
            </v-card-title>
            <v-card-text class="text-center pt-2 grey--text text--darken-3">
                Penyesuaian bibit ini akan diproses setelah <b>disetujui</b> oleh REGIONAL MANAGER / PROGRAM MANAGER. <br>
                Yakin ingin mengirim permintaan penyesuaian bibit ini?
            </v-card-text>
            <v-card-actions>
                <v-btn @click="() => $emit('close')" small text color="blue" rounded><v-icon class="mr-1">mdi-undo</v-icon> Back</v-btn>
                <v-divider class="mx-2"></v-divider>
                <v-hover v-slot="{hover}">
                    <v-btn @click="() => $emit('confirm')" small rounded :outlined="hover ? false : true" color="orange white--text" class="px-5 pr-1">Okay, Send <v-icon class="ml-1">mdi-send-circle</v-icon></v-btn>
                </v-hover>
            </v-card-actions>
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