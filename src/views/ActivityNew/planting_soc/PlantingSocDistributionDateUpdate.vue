<template>

    <v-dialog v-model="isOpen" width="75%">
        <template v-slot:default="{ isActive }" v-if="formData">
            <v-card>
                <v-card-title class="text-center"> Perbarui Tanggal Distribusi </v-card-title>
                <v-card-text>

                </v-card-text>
            </v-card>
        </template>
    </v-dialog>

</template>

<script>
export default {
    name: 'planting-soc-distribution-date-edit',
    data() {
        return {
            isOpen: false,
            formData: null,
            loading: false,

        }
    },
    props: {
        dataKey: {
            required: true,
            type: Number,
        },
        data: {
            required: false,
            default: null
        }
    },

    mounted() {

    },

    methods: {
        async onOpen() {
            try {

                this.$set(this.formData, 'ff_no', this.data.ff_no)
                this.$set(this.formData, 'distribution_date', this.data.distribution_date)

                this.isOpen = true;

            }

            catch (err) {

                let errMessage = typeof err === 'string' ? err : 'An error occured'
                this.$_alert.error(errMessage)
            }


        },



        async onSubmit() {
            if (this.loading) return
            try {

                this.isOpen = false
                this.formData = null
                this.loading = false
            }

            catch (err) {
                this.loading = false

            }
        }
    },


    watch: {
        dataKey(t) {
            if (t > 1) {
                this.onOpen()
            }
        },
    },
}
</script>