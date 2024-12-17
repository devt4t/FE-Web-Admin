<template>

    <v-dialog v-model="isOpen" width="75%" class="planting-soc-farmer-create-modal">
        <template v-slot:default="{ isActive }" v-if="formData">
            <v-card class="planting-soc-farmer-card">
                <v-card-title class="text-center"> Tambah Data Petani</v-card-title>
                <v-card-text>

                    <ValidationObserver ref="firstForm" v-slot="{ handleSubmit }">

                        <table class="geko-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Nama Petani</th>
                                    <th>No. Lahan</th>
                                    <th>Luas</th>
                                    <th>Area Tanam</th>
                                    <th>Bibit</th>
                                    <th>Total Bibit</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, i) in farmerList">
                                    <td>
                                        <v-checkbox v-model="item.checklist" color="success"></v-checkbox>
                                    </td>
                                    <td>
                                        {{ item.farmer_name }}
                                    </td>
                                    <td>{{ item.lahan_no }}</td>
                                    <td class="font-weight-bold">{{ item.land_area | parse('ts') }} m3</td>
                                    <td class="font-weight-bold">{{ item.planting_area | parse('ts') }} m3</td>
                                    <td>
                                        <ul class="d-flex flex-col flex-column">
                                            <li v-for="(tree) in item.trees">
                                                <v-icon>mdi-tree</v-icon>
                                                <span class="ml-1">{{ tree.tree_name }} : <span
                                                        class="font-weight-bold">{{ tree.amount | parse('ts')
                                                        }}</span></span>
                                            </li>
                                        </ul>
                                    </td>

                                    <td class="font-weight-bold">
                                        <span>{{ item.total_kayu + item.total_mpts | parse('ts') }} bibit</span>
                                    </td>
                                </tr>
                            </tbody>

                        </table>


                        <v-row>
                            <v-col lg="12">
                                <div class="d-flex flex-row justify-content-center mb-3">
                                    <v-btn :disabled="loading || farmerList.length == 0" variant="warning" type="submit"
                                        @click="onSubmit">
                                        <v-icon>mdi-pencil</v-icon>
                                        <span class="ml-1">Tambah Data Petani</span>
                                    </v-btn>
                                </div>
                            </v-col>
                        </v-row>
                    </ValidationObserver>
                </v-card-text>
            </v-card>
        </template>
    </v-dialog>

</template>

<script>
export default {
    name: 'planting-soc-farmer-create',
    data() {
        return {
            isOpen: false,
            formData: null,
            loading: false,
            farmerList: [],
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

            this.formData = this.data
            const ffLahan = await this.$_api.get("getFFLahanSostamNew", {
                ff_no: this.data.ff_no,
                program_year: this.$_config.programYear.model,
            });

            let farmerList = []
            try {
                farmerList = ffLahan.data.result.lahans
            }
            catch {

            }

            if (!Array.isArray(farmerList)) {
                farmerList = []
            }
            for (const farmer of farmerList) {
                farmer.checklist = true
                farmer.soc_no = this.data.soc_no
            }

            this.farmerList = farmerList

        },
        async onSubmit() {
            if (this.loading) return
            try {

                this.loading = true
                for (const payload of this.farmerList) {
                    const updating = await this.$_api.post('sostam/farmer/create', {
                        soc_no: payload.soc_no,
                        farmer_no: payload.farmer_no,
                        lahan_no: payload.lahan_no,
                        program_year: this.$store.state.tmpProgramYear
                    })
                        .catch(() => false)

                    if (!updating) {
                        throw "err"
                    }

                }

                this.$_alert.success("Data petani berhasil ditambahkan")
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
                this.onOpen()
            }
        },
    },
}
</script>