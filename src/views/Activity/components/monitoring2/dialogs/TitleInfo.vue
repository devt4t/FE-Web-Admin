<template>
    <v-dialog 
        v-model="showDialog" 
        max-width="500px"
        content-class="rounded-xl"
    >
        <v-card>
            <v-card-title class="d-flex align-center">
                <p class="mb-0 blue--text">
                    <v-icon color="blue">mdi-information</v-icon>
                    Informasi
                </p>
                <v-divider class="mx-2"></v-divider>
                <v-icon color="red" @click="() => showDialog = false">mdi-close-circle</v-icon>
            </v-card-title>
            <v-card-text>
                <h3 class="mb-3 mt-5 green--text"><v-icon color="green">mdi-forest</v-icon> Tampilkan Jumlah Total Pohon.</h3>
                <p>Data ini hanya mengambil data dari <b>"Realisasi Tanam / Monitoring 1"</b>. <br>Jumlah pohon yang tertera adalah jumlah pohon yang <b>ditanam</b> dan <b>hidup</b>, dan yang sudah <b>diverifikasi</b> oleh Unit Manager.</p>
            </v-card-text>
            <v-card-actions>
                <v-divider class="mr-2"></v-divider>
                <v-btn rounded outlined color="blue" class="pl-1" @click="() => showDialog = false">
                    <v-icon class="mr-1">mdi-check-circle</v-icon>
                    OK
                </v-btn>
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
        }
    },
    computed: {
        showDialog: {
            get: function () {
                return this.show
            },
            set: function (val) {
                if (val == false) this.$emit('close', 'titleInfo')
            }
        }
    }

}
</script>