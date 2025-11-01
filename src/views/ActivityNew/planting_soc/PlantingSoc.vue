<template>
    <geko-base-crud @onGetListData="onGetListData($event)" :config="config" :refreshKey="refreshKey" :hideDetail="false" :hideUpdate="true">

        <template v-slot:list-before-create>
            <planting-soc-farmer-edit @success="refreshKey += 1" :dataKey="farmerEditKey" :data="farmerEditData" />
            <planting-soc-export-lahan-mu :dataKey="exportLahanKey" />
            <planting-soc-export-sostam-mu :dataKey="exportSostamKey" />
            <planting-soc-import-excel :dataKey="importSostamKey" />
            <planting-soc-coordinate-edit :dataKey="sostamCoordinateEditKey" :data="sostamCoordinateData" />

            <planting-soc-distribution-date-update :dataKey="sostamDistributionEditKey"
                :data="sostamDistributionData" @success="refreshKey += 1" />
            <update-distribution-location :data="distributionLocationDatas" :dataKey="distributionLocationKey" @success="refreshKey += 1" />
        </template>

        <template v-slot:list-after-filter>
            <div class="d-flex flex-row justify-content-start">
                <v-btn variant="info" class="mr-2" @click="exportLahanKey += 1">
                    <v-icon>mdi-table-arrow-right</v-icon>
                    <span>Export Excel By MU</span>
                </v-btn>

                <v-btn variant="primary" class="mr-2" @click="importSostamKey += 1">
                    <v-icon>mdi-cloud-sync</v-icon>
                    <span>Import Excel Sostam</span>
                </v-btn>

                <v-btn variant="success"  @click="exportSostamKey += 1">
                    <v-icon>mdi-table</v-icon>
                    <span>Export Excel</span>
                </v-btn>
            </div>
        </template>

        <template v-slot:list-indicator="{ item }">
            <div class="indicator-wrapper pt-1">
                <div class="indicator" :class="{
                    info: item.gis_status == 1 && !item.verified,
                    success: item.gis_status == 1 && item.verified,
                    danger: item.gis_status == 2,
                    warning: !item.gis_status,
                }">
                </div>
            </div>
        </template>

        <template v-slot:list-status="{ item }">
            <div class="d-flex flex-col min-w-200px">
                <div class="d-flex flex-row">
                    <span class="badge" :class="{
                        'bg-warning': !item.gis_status,
                        'bg-danger': item.gis_status == 2,
                        'bg-success': item.gis_status == 1 && item.verified,
                        'bg-info': item.gis_status == 1 && !item.verified
                    }">

                        <span v-if="!item.gis_status">Menunggu Verifikasi GIS</span>
                        <span v-else-if="item.gis_status == 2">Koordinat Tidak Sesuai</span>
                        <span v-else-if="item.gis_status == 1 && !item.verified">Koordinat Terverifikasi</span>
                        <span v-else-if="item.gis_status == 1 && item.verified">Terverifikasi</span>
                    </span>
                </div>

                <blockquote class="text-09-em text-italic mt-1" v-if="item.suggestion_note && item.gis_status == 2">
                    <v-icon small class="mr-1">mdi-note-alert-outline</v-icon> <span>{{
                        item.suggestion_note }}</span>
                </blockquote>
            </div>
        </template>

        <template v-slot:list-countdown_timer="{ item }">
            <div class="">
                <v-chip v-if="item.timeleft" small color="red" text-color="white">
                {{ item.timeleft }}
                </v-chip>
            </div>
        </template>

        <template v-slot:list-bottom-action="{ item }">


            <v-btn variant="primary" small class="mt-2" @click="onClickEditDistributionDate(item)"
                v-if="$_sys.isAllowed('sosialisasi-tanam-distribution-update') && !item.timeleft && !item.verified">
                <v-icon left small>mdi-calendar</v-icon>
                <span>Edit Tgl. Distribusi</span>
            </v-btn>
            <v-btn variant="warning" small class="mt-2" @click="onClickEditCoordinate(item)"
                v-if="$_sys.isAllowed('sosialisasi-tanam-update') && item.gis_status == 2">
                <v-icon left small>mdi-map</v-icon>
                <span>Edit Koordinat</span>
            </v-btn>
            <v-btn variant="success" small class="d-block mt-2" @click="onExportExcel(item)">
                <v-icon v-if="!exportIds.includes(item.ff_no)">mdi-microsoft-excel</v-icon>
                <v-progress-circular v-else indeterminate :size="20" color="success"></v-progress-circular>

                <span>Export Excel</span>
            </v-btn>
            <v-btn v-if="!item.verified && $_sys.isAllowed('sosialisasi-tanam-verification-create') && item.timeleft" variant="success"
                small class="mt-2" @click="onVerif(item)">
                <v-icon small>mdi-check-bold</v-icon>
                <span>Verifikasi</span>
            </v-btn>
            <v-btn v-else-if="item.verified && $_sys.isAllowed('sosialisasi-tanam-unverification-create')"
                variant="danger" small class="mt-2" @click="onUnverif(item)">
                <v-icon left small>mdi-undo</v-icon>
                <span>Unverifikasi</span>
            </v-btn>
            <v-btn v-if="$_sys.isAllowed('sosialisasi-tanam-unverification-create') && !item.verified" variant="info" small class="mt-2"
                @click="onUpdateDistributionLocation(item)">
                <v-icon left small>mdi-update</v-icon>
                <span>Edit Alamat Distribusi</span>
            </v-btn>

        </template>
        <template v-slot:list-expanded-item="{ headers, item }">
            <planting-soc-list-ff :item="item" :headers="headers" @edit="onEditFarmer($event)"></planting-soc-list-ff>
        </template>

        <template v-slot:create-form>
            <planting-soc-form></planting-soc-form>
        </template>

        <template v-slot:detail-row>
            <planting-soc-detail />
        </template>
    </geko-base-crud>
</template>

<script>
import config from './PlantingSocConfig.js'
import PlantingSocListFf from './PlantingSocListFF.vue'
import PlantingSocForm from './PlantingSocForm.vue'
import moment from 'moment'
import axios from 'axios'
import PlantingSocDetail from './PlantingSocDetail.vue'
import PlantingSocExportLahanMu from './PlantingSocExportLahanMu.vue'
import PlantingSocExportSostamMu from './PlantingSocExportSostamMu.vue'
import "./planting-soc.scss";
import PlantingSocFarmerEdit from './PlantingSocFarmerEdit.vue'
import PlantingSocImportExcel from './PlantingSocImportExcel.vue'
import PlantingSocCoordinateEdit from './PlantingSocCoordinateEdit.vue'
import PlantingSocDistributionDateUpdate from './PlantingSocDistributionDateUpdate.vue'
import UpdateDistributionLocation from './UpdateDistributionLocation.vue'
export default {
    name: "crud-planting-socialization",
    components: {
        PlantingSocListFf,
        PlantingSocForm,
        PlantingSocFarmerEdit,
        PlantingSocDetail,
        PlantingSocExportLahanMu,
        PlantingSocExportSostamMu,
        PlantingSocImportExcel,
        PlantingSocCoordinateEdit,
        PlantingSocDistributionDateUpdate,
        UpdateDistributionLocation
    },
    watch: {},
    mounted() {
        console.log({items:this})
    },
    methods: {
        onEditFarmer(item) {
            this.farmerEditKey += 1
            this.farmerEditData = item
        },
        onClickEditCoordinate(item) {
            this.sostamCoordinateEditKey += 1
            this.sostamCoordinateData = item
        },
        onClickEditDistributionDate(item) {
            this.sostamDistributionEditKey += 1
            this.sostamDistributionData = item
        },
        async onExportExcel(item) {
            try {
                if (this.exportIds.includes(item.ff_no)) return
                this.exportIds.push(item.ff_no)
                const ffData = await this.$_api.get('GetSosisalisasiTanamAdmin', {
                    program_year: this.$store.state.tmpProgramYear,
                    ff_no: item.ff_no,
                    typegetdata: 'all',
                    limit: 10000,
                    offset: 0,
                    export: true
                })


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
                console.log('exp', exported);

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
                    validate_by: this.$store.state.User.employee_no,
                    program_year: this.$store.state.tmpProgramYear
                })
                    .then(() => {
                        clearInterval(this.intervals[item.soc_no]);
                        this.$_alert.success('Sostam berhasil diverifikasi')
                        this.refreshKey += 1
                    }).finally(() => {
                        clearInterval(this.intervals[item.soc_no])
                    })

            }
        },
        async onUnverif(item) {
            const prompt = await this.$_alert.confirm('Unverifikasi Data Sostam?', 'Apakah anda yakin akan mengurungkan verifikasi data sostam ini?', 'Ya, Unverifikasi', 'Batal', true)
            // console.log('item', item)
            if (prompt.isConfirmed) {

                const isConfirmed = await this.$_api.post('sostam/unverification', {
                    soc_no: item.soc_no,
                    program_year: this.$store.state.tmpProgramYear
                })
                    .catch(() => false)

                if (!isConfirmed) {
                    this.$_alert.error('Data sostam gagal diunverifikasi')
                    return
                }

                this.$_alert.success('Data sostam berhasil diunverifikasi')
                this.refreshKey += 1
                // this.$_api.post('ValidateSosisalisasiTanam', {
                //     soc_no: item.soc_no,
                //     validate_by: this.$store.state.User.employee_no
                // })
                //     .then(() => {
                //         this.$_alert.success('Sostam berhasil diverifikasi')
                //         this.$refreshKey += 1
                //     })

            }
        },
        onUpdateDistributionLocation(item) {
            this.distributionLocationKey += 1
            this.distributionLocationDatas = item
        },
        onGetListData(data) {

            // data.map(item => {
            //     function getRandomInt(min, max) {
            //         min = Math.ceil(min);
            //         max = Math.floor(max);
            //         return Math.floor(Math.random() * (max - min + 1)) + min;
            //     }

            //     item.created_at = [
            //         "2025-09-19 09:05:22",
            //         "2025-09-19 05:53:36",
            //     ][getRandomInt(0,1)];
            // })

            let intervals = [];

            data.map(item => {
                console.log(moment(item.updated_at).add(1, 'days').format("YYYY-MM-DD HH:mm:ss"), moment().format("YYYY-MM-DD HH:mm:ss"))
                if (
                    moment().format("YYYY-MM-DD HH:mm:ss") > moment(item.updated_at).add(1, 'days').format("YYYY-MM-DD HH:mm:ss") ||
                    item.verified == 1
                ) return;

                this.intervals[item.soc_no] = setInterval(() => {
                    const d1 = moment().format("YYYY-MM-DD HH:mm:ss");
                    const d2 = moment(item.updated_at).add(1, 'days');

                    const diff = moment.duration(d2.diff(d1));

                    const totalSeconds = diff.asSeconds();
                    const hours = Math.floor(totalSeconds / 3600);
                    const minutes = Math.floor((totalSeconds % 3600) / 60);
                    const seconds = Math.floor(totalSeconds % 60);

                    const formatted = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
                    this.$set(item, 'timeleft', totalSeconds <= 0 ? '00:00:00':formatted)
                    
                    // console.log(totalSeconds, item.verified);
                    if (totalSeconds <= 0) {
                        // this.resetDistributionDate(item.soc_no,item.updated_at);
                        clearInterval(this.intervals[item.soc_no]);
                    }
                }, 1000);
            })
        },
        async resetDistributionDate(soc_no, updated_at) {
            this.$_api.post('ResetDistributionDate', { soc_no, updated_at }).then(() => {
                this.refreshKey += 1
            })
        }
    },
    data() {
        return config
    },
};
</script>