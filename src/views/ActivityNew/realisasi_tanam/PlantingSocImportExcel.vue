<template>
    <v-dialog v-model="isOpen" width="50%">
        <template v-slot:default="{ isActive }">
            <v-card>
                <v-card-title>
                    <span>Import Excel (Verifikasi Distribusi GIS)</span>
                </v-card-title>

                <v-card-text class="farmer-assign-wrapper mt-3">
                    <div v-if="step == 0">
                        <input type="file" @change="onUploadFile" />

                        <div class="d-flex flex-row justify-content-center" @click="importExcel">
                            <v-btn variant="success">
                                <v-icon>mdi-cloud-sync</v-icon>
                                <span>Import Excel</span>
                            </v-btn>
                        </div>
                    </div>
                </v-card-text>
            </v-card>
        </template>
    </v-dialog>
</template>

<script>
import axios from "axios";
import moment from "moment";
export default {
    name: "planting-soc-export-lahan-mu",
    data() {
        return {
            isOpen: false,
            loading: false,
            excelFile: null,
            step: 0
        };
    },
    props: {
        dataKey: {
            required: false,
            default: false,
        },
    },

    watch: {
        dataKey(t) {
            if (t > 0) {
                this.isOpen = true;
            }
        },
    },

    methods: {
        async importExcel() {
            if (!this.excelFile) {
                this.$_alert.error('File excel belum diupload')
                return
            }
            if (this.loading) return
            this.loading = true
            let data = new FormData();
            data.append('file', this.excelFile);

            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: `${this.$_config.baseUrlExport}sostam/mu/import`,
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                data: data
            };

            const responseData = await axios.request(config)
                .then((response) => {
                    return response.data.data
                })
                .catch((error) => {
                    this.$_alert.error(error.response.data.message)
                    return false
                });

            if (!responseData) {
                this.loading = false
                return
            }

            const updated = await this.$_api.post('sostam/gis-verification', {
                data: responseData
            })
                .catch(() => false)

            if (!updated) {
                return
            }
            console.log(updated);
            this.loading = false
            this.$_alert.success("Data sostam berhasil diimport")
            this.isOpen = false

        },
        onUploadFile(e) {
            this.excelFile = e.target.files[0]

        }
    },

    mounted() {
        // this.getInitialData();
    },


};
</script>