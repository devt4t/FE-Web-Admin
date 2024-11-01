<template>
    <geko-base-crud :config="config" :refreshKey="refreshKey" :hideDetail="true" :hideUpdate="true">

        <template v-slot:list-bottom-action="{ item }">
            <v-btn variant="success" small class="d-block" @click="onExportExcel(item)">
                <v-icon v-if="!exportIds.includes(item.ff_no)">mdi-microsoft-excel</v-icon>
                <v-progress-circular v-else indeterminate :size="20" color="success"></v-progress-circular>

                <span>Export Excel</span>
            </v-btn>
            <v-btn v-if="!item.verified" variant="success" small class="mt-2" @click="onVerif(item)">
                <v-icon small>mdi-check-bold</v-icon>
                <span>Verifikasi</span>
            </v-btn>
            <v-btn v-else variant="danger" small class="mt-2" @click="onUnverif(item)">
                <v-icon left small>mdi-undo</v-icon>
                <span>Unverifikasi</span>
            </v-btn>
        </template>
        <template v-slot:list-expanded-item="{ headers, item }">
            <planting-soc-list-ff :item="item" :headers="headers"></planting-soc-list-ff>
        </template>

        <template v-slot:create-form>
            <planting-soc-form></planting-soc-form>
        </template>

    </geko-base-crud>
</template>

<script>
import config from './PlantingSocConfig.js'
import PlantingSocListFf from './PlantingSocListFF.vue'
import PlantingSocForm from './PlantingSocForm.vue'
import moment from 'moment'
import axios from 'axios'

import "./planting-soc.scss";
export default {
    name: "crud-planting-socialization",
    components: {
        PlantingSocListFf,
        PlantingSocForm
    },
    watch: {},
    methods: {
        async onExportExcel(item) {
            try {
                if (this.exportIds.includes(item.ff_no)) return
                this.exportIds.push(item.ff_no)
                const ffData = await this.$_api.get('GetSosisalisasiTanamAdmin', {
                    program_year: 2024,
                    ff_no: item.ff_no,
                    limit: 10000,
                    offset: 0,
                    export: true
                })

                console.log('ff', ffData);

                if (!Array.isArray(ffData.data)) throw "err"
                if (ffData.data.length == 0) throw "err"

                //EXPORT DATA
                const exportEndpoint = `${this.$_config.baseUrlExport}export/soc-planting/excel`
                const exportPayload = {
                    data: ffData.data
                }
                const exportFilename = `Export-SosialisasiTanam-${ffData.data[0].field_facilitators_name.replace(/ /g, '')}-${ffData.data[0].ff_no}-${moment().format('DD-MM-YYYY-HH:mm:ss')}.xlsx`

                const axiosConfig = {
                    method: "POST",
                    url: exportEndpoint,
                    responseType: "arraybuffer",
                    data: exportPayload,
                    headers: {
                        "content-type": "application/json",
                        Authorization: `Bearer ${this.$store.state.token}`,
                    },
                };

                const exported = await axios(axiosConfig)
                    .then((res) => {
                        return res;
                    })
                    .catch((err) => {
                        return false;
                    });

                if (!exported) throw "ERR"
                const url = URL.createObjectURL(new Blob([exported.data]));
                const link = document.createElement("a");
                link.href = url;

                const filename = exportFilename;
                link.setAttribute("download", filename);
                document.body.appendChild(link);
                link.click();
                let idx = this.exportIds.findIndex(x => x === item.ff_no)
                if (idx > -1) this.exportIds.splice(idx, 1)

            }

            catch (err) {
                console.log('err', err);

                let idx = this.exportIds.findIndex(x => x === item.ff_no)
                if (idx > -1) this.exportIds.splice(idx, 1)
            }

        },
        async onVerif(item) {
            const prompt = await this.$_alert.confirm('Verifikasi Data Sostam?', 'Apakah anda yakin akan memverifikasi data sostam ini?', 'Ya, Verifikasi', 'Batal', true)

            if (prompt.isConfirmed) {
                this.$_api.post('ValidateSosisalisasiTanam', {
                    soc_no: item.soc_no,
                    validate_by: this.$store.state.User.employee_no
                })
                    .then(() => {
                        this.$_alert.success('Sostam berhasil diverifikasi')
                        this.$refreshKey += 1
                    })

            }
        },
        async onUnverif(item) {
            const prompt = await this.$_alert.confirm('Unverifikasi Data Sostam?', 'Apakah anda yakin akan mengurungkan verifikasi data sostam ini?', 'Ya, Unverifikasi', 'Batal', true)

            if (prompt.isConfirmed) {
                // this.$_api.post('ValidateSosisalisasiTanam', {
                //     soc_no: item.soc_no,
                //     validate_by: this.$store.state.User.employee_no
                // })
                //     .then(() => {
                //         this.$_alert.success('Sostam berhasil diverifikasi')
                //         this.$refreshKey += 1
                //     })

            }
        }
    },
    data() {
        return config
    },
};
</script>