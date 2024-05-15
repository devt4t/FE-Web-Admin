<template>
    <v-card data-aos="fade-up" data-aos-delay="200" class="geko-form-card mb-5">

        <v-card-title>
            <v-icon large class="mr-2" @click="$router.go(-1)">mdi-arrow-left-circle</v-icon>
            <h4 class="mb-0 pb-0">Tambah {{ title }}</h4>
        </v-card-title>



        <ValidationObserver ref="mainForm" v-slot="{ handleSubmit }">
            <form @submit.prevent="handleSubmit(onSubmit)" autocomplete="off">
                <v-row class="geko-form-wrapper m-4">
                    <v-col md="12" v-for="(item, i) in fields.filter(x => x.input)" :key="title + i">
                        <geko-input v-model="formData[item.view_data]" :item="{
                            label: item.label,
                            type: item.type,
                            validation: item.validation
                        }" />
                    </v-col>

                    <v-col md="12">
                        <div class="form-footer">
                            <v-btn variant="light" class="mr-3" @click="$router.go(-1)">
                                Batal
                            </v-btn>
                            <v-btn variant="success" type="submit">
                                <v-icon>mdi-plus</v-icon>
                                <span>Tambah Data</span>
                            </v-btn>
                        </div>
                    </v-col>

                </v-row>
            </form>
        </ValidationObserver>
    </v-card>
</template>

<script>
export default {
    name: 'geko-base-form',
    props: {
        title: {
            required: true,
            type: String,
        },
        fields: {
            required: true,
            type: Array,
            default: []
        }
    },

    data() {
        return {
            formData: {}
        }
    },


    mounted() {
        this.buildFields()

    },

    methods: {
        buildFields() {
            for (const f of this.fields) {
                this.$set(this.formData, f.view_data, null)
            }
        },
        onSubmit() {
            let payload = JSON.parse(JSON.stringify(this.formData))
            for (const f of this.fields) {
                if (f.input) continue
                if (f.default === 'current_user_id') {
                    payload[f.view_data] = this.$store.state['User'].id
                }


            }

            console.log('payload', payload)

        }
    }
}
</script>