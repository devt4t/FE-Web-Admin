<template>

    <v-dialog v-model="isOpen" width="50%">
        <template v-slot:default="{ isActive }" v-if="formData">
            <v-card>
                <v-card-title class="text-center"> Perbarui Data </v-card-title>
                <v-card-text>

                    <ValidationObserver ref="firstForm" v-slot="{ handleSubmit }">
                        <form @submit.prevent="handleSubmit(onSubmit)" autocomplete="off">
                            <v-row>
                                <v-col lg="12">
                                    <geko-input v-model="formData.farmers_name" :item="{
                                        type: 'text',
                                        label: 'Petani'
                                    }" :disabled="true" />
                                </v-col>
                                <v-col lg="12">
                                    <geko-input v-model="formData.field_facilitators_name" :item="{
                                        type: 'text',
                                        label: 'FF'
                                    }" :disabled="true" />
                                </v-col>

                                <v-col lg="12">
                                    <geko-input v-model="formData.soc_no" :item="{
                                        type: 'text',
                                        label: 'No. Sostam'
                                    }" :disabled="true" />
                                </v-col>

                                <v-col md="12">
                                    <geko-input v-model="formData.attendance" :item="{
                                        type: 'select-radio',
                                        label: 'Kehadiran',
                                        validation: ['required'],
                                        option: {
                                            list_pointer: {
                                                label: 'label',
                                                code: 'code',
                                                display: ['label']
                                            },
                                            default_options: [
                                                {
                                                    label: 'Hadir',
                                                    code: '1',
                                                },
                                                {
                                                    label: 'Tidak Hadir',
                                                    code: '0'
                                                }
                                            ]
                                        }
                                    }" :disabled="true" />
                                </v-col>

                                <v-col lg="12">
                                    <div class="d-flex flex-row">
                                        <v-btn variant="warning" type="submit" :disabled="loading">
                                            <v-icon>mdi-pencil</v-icon>
                                            <span class="ml-1">Perbarui Data</span>
                                        </v-btn>
                                    </div>
                                </v-col>
                            </v-row>
                        </form>
                    </ValidationObserver>

                </v-card-text>
            </v-card>
        </template>
    </v-dialog>

</template>

<script>
export default {
    name: 'planting-soc-farmer-edit',
    data() {
        return {
            isOpen: false,
            formData: null,
            loading: false
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
        async onSubmit() {
            if (this.loading) return
            try {

                this.loading = true
                const updating = await this.$_api.post('/sostam/farmer/update', this.formData)
                    .catch(() => false)

                if (!updating) {
                    throw "err"
                }

                this.$_alert.success("Data sostam berhasil diperbarui")
                this.$emit('success', true)
                this.isOpen = false
                this.formData = null
                this.loading = false
            }

            catch (err) {
                console.log('err', err);
                this.loading = false

            }
        }
    },


    watch: {
        dataKey(t) {
            if (t > 1) {
                this.isOpen = true;
                this.formData = this.data
                this.$set(this.formData, 'attendance', this.formData.attendance ? "1" : '0')
                console.log(this.data)
            }
        },
    },
}
</script>