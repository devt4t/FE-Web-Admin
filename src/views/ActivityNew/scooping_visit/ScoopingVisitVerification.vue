<template>

    <v-dialog v-model="isOpen" width="50%">
        <template v-slot:default="{ isActive }">
            <v-card>
                <v-card-title class="text-center"> Verifikasi </v-card-title>
                <v-card-text>
                    <ValidationObserver ref="firstForm" v-slot="{ handleSubmit }">
                        <form @submit.prevent="handleSubmit(onSubmit)" autocomplete="off">
                            <v-row class="scooping-visit-gis-verification">

                                <v-col md="6">
                                    <geko-input v-model="potential_status" :item="{
                                        label: 'Status Potensial',
                                        validation: ['required'],
                                        type: 'select',
                                        option: {
                                            default_options: [
                                                {
                                                    text: 'Berpotensi',
                                                    value: 1
                                                },
                                                {
                                                    text: 'Tidak berpotensi',
                                                    value: 0
                                                }
                                            ],
                                            list_pointer: {
                                                code: 'value',
                                                label: 'text',
                                                display: ['text'],
                                            },
                                        },
                                    }" />
                                </v-col>


                                <v-col md="12" class="d-flex flex-row justify-content-end">
                                    <v-btn variant="light" @click="isOpen = false" class="mr-2">
                                        Batal
                                    </v-btn>
                                    <v-btn type="submit" :disabled="loading || !ready" variant="success">
                                        Verifikasi
                                    </v-btn>
                                </v-col>
                            </v-row>
                        </form>
                    </ValidationObserver>
                </v-card-text>
                <!-- </template> -->
            </v-card>
        </template>
    </v-dialog>
</template>

<script>
export default {
    name: 'scooping-visit-verification',
    props: {
        dataKey: {
            required: true,
            type: Number,
        },
    },
    data() {
        return {
            isOpen: false,
            potential_status: null,
            loading: false,
            ready: false
        }
    },

    methods: {
        onSubmit() {
            if (this.loading) return
            this.loading = true

            const payload = {
                current_id: parseInt(this.$route.query.id),
                verificator_email: this.$store.state.User.email,
                potential_status: parseInt(this.potential_status)
            }
            this.$_api.post('UpdateVerifScoopingVisit_new', payload)
                .then(() => {
                    this.$_alert.success("Data berhasil diverifikasi")
                    this.isOpen = false
                    this.loading = false
                    this.$emit('success', true)
                })
                .catch(err => {
                    this.$_alert.error(err)
                    this.loading = false
                })
        }
    },

    watch: {
        dataKey(t) {
            if (t > 1) {
                this.isOpen = true;

                setTimeout(() => {
                    this.ready = true
                }, 10000)
            }
        },
    },
}
</script>