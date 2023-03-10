<template>
    <v-dialog v-model="showDialog" content-class="rounded-xl" max-width="500">
        <v-card>
            <v-card-title class="grey--text">
                <v-spacer></v-spacer>
                <v-icon class="mr-1" color="grey">mdi-information</v-icon> Confirmation
                <v-spacer></v-spacer>
            </v-card-title>
            <v-card-text class="text-center pt-2 grey--text text--darken-3">
                <span v-if="type == 'verification'">
                    Apakah anda yakin untuk memverifikasi data penyesuaian bibit ini?
                </span>
                <span v-else>
                    Penyesuaian bibit ini akan diproses setelah <b>disetujui</b> oleh REGIONAL MANAGER / PROGRAM MANAGER. <br>
                    Yakin ingin mengirim permintaan penyesuaian bibit ini?
                </span>
            </v-card-text>
            <v-card-actions>
                <v-btn @click="() => $emit('close')" small text color="blue" rounded><v-icon class="mr-1">mdi-undo</v-icon> Back</v-btn>
                <v-divider class="mx-2"></v-divider>
                <v-hover v-slot="{hover}">
                    <v-btn @click="() => $emit('confirm')" small rounded :outlined="hover ? false : true" :color="getConfirmationBtnColor" class="px-5 pr-1">{{ getConfirmationBtnText }} <v-icon class="ml-1">{{ getConfirmationBtnIcon }}</v-icon></v-btn>
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
        type: {
            type: String,
            default: null
        }
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
        getConfirmationBtnIcon() {
            let icon = ''
            if (this.type == 'verification') icon = 'check-circle'
            else icon = 'send-circle'
            return 'mdi-' + icon
        },
        getConfirmationBtnColor() {
            let color = ''
            if (this.type == 'verification') color = 'green'
            else color = 'orange'
            return color + ' white--text'
        },
        getConfirmationBtnText() {
            let text = 'Okay'
            if (this.type == 'verification') text += ', verif'
            else text += ', send'
            return text
        }
    }
}
</script>