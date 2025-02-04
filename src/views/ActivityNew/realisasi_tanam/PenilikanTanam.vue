<template>
    <geko-base-crud :config="config" :refreshKey="refreshKey" :hideDetail="false" :hideUpdate="true" :hideCreate="true"
        @searchColumChanged="searchColumChanged($event)">

        <template v-slot:list-before-create>
            <planting-soc-farmer-edit @success="refreshKey += 1" :dataKey="farmerEditKey" :data="farmerEditData" />
            <planting-soc-export-lahan-mu :dataKey="exportLahanKey" />
            <planting-soc-import-excel :dataKey="importSostamKey" />
            <planting-soc-coordinate-edit :dataKey="sostamCoordinateEditKey" :data="sostamCoordinateData" />

            <planting-soc-distribution-date-update :dataKey="sostamDistributionEditKey"
                :data="sostamDistributionData" />
        </template>

        <template v-slot:list-after-filter>
            <div class="d-flex flex-row justify-content-start">
                <v-btn variant="info" class="mr-2" @click="exportLahanKey += 1">
                    <v-icon>mdi-table-arrow-right</v-icon>
                    <span>Export Excel </span>
                </v-btn>

                <!-- <v-btn variant="primary" @click="importSostamKey += 1">
                    <v-icon>mdi-cloud-sync</v-icon>
                    <span>Import Excel Sostam</span>
                </v-btn> -->
            </div>
        </template>

        <template v-slot:list-indicator="{ item }">
            <div class="indicator-wrapper pt-1">
                <div class="indicator" :class="{
                    info: item.gis_status == 1 && !item.is_validate,
                    success: item.gis_status == 1 && item.is_validate,
                    danger: item.gis_status == 2,
                    warning: !item.gis_status,
                }">
                </div>
            </div>
        </template>

        <template v-slot:list-farmers_name="{ item }">
            <div class="d-flex flex-col min-w-100px">
                <span>{{ item.farmers_name }}</span>
            </div>
        </template>

        <template v-slot:list-lahan_no="{ item }">
            <span class="badge bg-info">
                <span>{{ item.lahan_no }}</span>
            </span>
        </template>

        <template v-slot:list-qty_std="{ item }">
            <span class="badge bg-info min-w-10px d-flex">
                <v-icon size="small">mdi-seed</v-icon> &nbsp;{{ item.qty_std }}
            </span>
        </template>
        <template v-slot:detail-qty_std="{ item }">
            <span class="badge bg-info">
                <v-icon size="small">mdi-seed</v-icon> {{ item.qty_std }}
            </span>
        </template>

        <template v-slot:list-kayu="{ item }">
            <!-- <div class="pr-5 mr-5 d-flex flex-row" > -->
            <div class="d-flex flex-row min-w-100px" style="justify-content: space-around">

                <v-tooltip top>
                    <template v-slot:activator="{ on }">
                        <span v-on="on" class="badge bg-success">
                            <v-icon size="small">mdi-forest</v-icon> {{ item.kayu_hidup }}
                        </span>
                    </template>

                    <span>hidup</span>
                </v-tooltip>


                <v-tooltip top>
                    <template v-slot:activator="{ on }">
                        <span v-on="on" class="badge bg-danger">
                            <v-icon size="small">mdi-forest</v-icon> {{ item.kayu_mati }}
                        </span>
                    </template>

                    <span>mati</span>
                </v-tooltip>

            </div>
            <div class="d-flex flex-row min-w-100px mt-1" style="justify-content: space-around">
                <v-tooltip top>
                    <template v-slot:activator="{ on }">
                        <span v-on="on" class="badge bg-light">
                            <v-icon size="small">mdi-forest</v-icon> {{ item.kayu_hilang }}
                        </span>
                    </template>

                    <span>hilang</span>
                </v-tooltip>
            </div>
        </template>
        <template v-slot:detail-kayu="{ item }">
            <!-- <div class="pr-5 mr-5 d-flex flex-row" > -->
            <div>
                <div>
                    <v-tooltip top>
                        <template v-slot:activator="{ on }">
                            <span v-on="on" class="badge bg-success mr-1">
                                <v-icon size="small">mdi-forest</v-icon> {{ item.kayu_hidup }}
                            </span>
                        </template>

                        <span>hidup</span>
                    </v-tooltip>

                    <v-tooltip top>
                        <template v-slot:activator="{ on }">
                            <span v-on="on" class="badge bg-danger mr-1">
                                <v-icon size="small">mdi-forest</v-icon> {{ item.kayu_mati }}
                            </span>
                        </template>

                        <span>mati</span>
                    </v-tooltip>

                    <v-tooltip top>
                        <template v-slot:activator="{ on }">
                            <span v-on="on" class="badge bg-light">
                                <v-icon size="small">mdi-forest</v-icon> {{ item.kayu_hilang }}
                            </span>
                        </template>

                        <span>hilang</span>
                    </v-tooltip>
                </div>
            </div>
        </template>

        <template v-slot:list-mpts="{ item }">
            <!-- <div class="pr-5 mr-5 d-flex flex-row" > -->
            <div class="d-flex flex-row min-w-100px" style="justify-content: space-around">

                <v-tooltip top>
                    <template v-slot:activator="{ on }">
                        <span v-on="on" class="badge bg-success">
                            <v-icon size="small">mdi-forest</v-icon> {{ item.mpts_hidup }}
                        </span>
                    </template>

                    <span>hidup</span>
                </v-tooltip>


                <v-tooltip top>
                    <template v-slot:activator="{ on }">
                        <span v-on="on" class="badge bg-danger">
                            <v-icon size="small">mdi-forest</v-icon> {{ item.mpts_mati }}
                        </span>
                    </template>

                    <span>mati</span>
                </v-tooltip>

            </div>
            <div class="d-flex flex-row min-w-100px mt-1" style="justify-content: space-around">
                <v-tooltip top>
                    <template v-slot:activator="{ on }">
                        <span v-on="on" class="badge bg-light">
                            <v-icon size="small">mdi-forest</v-icon> {{ item.mpts_hilang }}
                        </span>
                    </template>

                    <span>hilang</span>
                </v-tooltip>
            </div>
        </template>
        <template v-slot:detail-mpts="{ item }">
            <!-- <div class="pr-5 mr-5 d-flex flex-row" > -->
            <div>
                <div>
                    <v-tooltip top>
                        <template v-slot:activator="{ on }">
                            <span v-on="on" class="badge bg-success mr-1">
                                <v-icon size="small">mdi-forest</v-icon> {{ item.mpts_hidup }}
                            </span>
                        </template>

                        <span>hidup</span>
                    </v-tooltip>

                    <v-tooltip top>
                        <template v-slot:activator="{ on }">
                            <span v-on="on" class="badge bg-danger mr-1">
                                <v-icon size="small">mdi-forest</v-icon> {{ item.mpts_mati }}
                            </span>
                        </template>

                        <span>mati</span>
                    </v-tooltip>

                    <v-tooltip top>
                        <template v-slot:activator="{ on }">
                            <span v-on="on" class="badge bg-light">
                                <v-icon size="small">mdi-forest</v-icon> {{ item.mpts_hilang }}
                            </span>
                        </template>

                        <span>hilang</span>
                    </v-tooltip>
                </div>
            </div>
        </template>

        <template v-slot:list-is_validate="{ item }">
            <div class="d-flex flex-col min-w-200px">
                <div class="d-flex flex-row">
                    <span class="badge" :class="{
                        'bg-danger': item.is_validate == 0,
                        'bg-warning': item.is_validate == 1, 
                        'bg-success': item.is_validate == 2,
                    }">

                        <span v-if="item.is_validate == 0">Belum Terverifikasi</span>
                        <span v-else-if="item.is_validate == 1">Terverifikasi FC</span>
                        <span v-else-if="item.is_validate == 2">Terverifikasi UM</span>
                    </span>
                </div>

            </div>
        </template>

        <template v-slot:list-is_populated="{ item }">
            <div class="d-flex flex-col min-w-200px">
                <div class="d-flex flex-row">
                    <span class="badge" :class="{
                        'bg-danger': item.is_populated == 0,
                        'bg-success': item.is_populated == 1, 
                    }">

                        <span v-if="item.is_populated == 0">Belum Terpopulasi</span>
                        <span v-else="item.is_populated == 1">Terpopulasi</span>
                    </span>
                </div>

            </div>
        </template>
        <template v-slot:list-start_monitoring_period="{ item }">
            <div class="d-flex flex-col min-w-200px">
                <div class="d-flex flex-row">
                    <span class="badge bg-primary">
                        <span>{{ item.start_monitoring_period | parse('datetime') }}</span>
                    </span>
                </div>

            </div>
        </template>

        <template v-slot:list-end_monitoring_period="{ item }">
            <div class="d-flex flex-col min-w-200px">
                <div class="d-flex flex-row">
                    <span class="badge bg-primary">
                        <span>{{ item.end_monitoring_period | parse('datetime') }}</span>
                    </span>
                </div>

            </div>
        </template>

        <template v-slot:detail-monitoring_period="{ item }">
            <div>
                <span class="badge bg-primary">{{ item.start_monitoring_period | parse('datetime') }}</span> ~ <span
                    class="badge bg-primary"> {{ item.end_monitoring_period | parse('datetime') }}</span>
            </div>
        </template>
        <template v-slot:list-bottom-action="{ item }">
            <div>
                <v-btn v-if="item.is_validate == 0 && $_sys.isAllowed('realisasi-tanam-verification-fc-create')"
                    variant="success" small class="mt-2" @click="onVerif(item, 'fc')">
                    <v-icon small>mdi-check-bold</v-icon>
                    <span>Verifikasi FC</span>
                </v-btn>
                <v-btn v-if="item.is_validate == 1 && $_sys.isAllowed('realisasi-tanam-verification-create')"
                    variant="success" small class="mt-2" @click="onVerif(item, 'um')">
                    <v-icon small>mdi-check-bold</v-icon>
                    <span>Verifikasi UM</span>
                </v-btn>
                <v-btn v-if="item.is_validate == 1 && $_sys.isAllowed('realisasi-tanam-unverification-fc-create')"
                    variant="danger" small class="mt-2" @click="onUnverif(item)">
                    <v-icon left small>mdi-undo</v-icon>
                    <span>Unverifikasi FC</span>
                </v-btn>
                <v-btn v-if="item.is_validate == 2 && $_sys.isAllowed('realisasi-tanam-unverification-create')"
                    variant="danger" small class="mt-2" @click="onUnverif(item)">
                    <v-icon left small>mdi-undo</v-icon>
                    <span>Unverifikasi UM</span>
                </v-btn>
            </div>
        </template>

        <template v-slot:detail-action="{ item }">
            <div>
                <v-btn v-if="item.is_validate == 0 && $_sys.isAllowed('realisasi-tanam-verification-fc-create')"
                    variant="success" small class="mt-2" @click="onVerifDetail(item, 'fc')">
                    <v-icon small>mdi-check-bold</v-icon>
                    <span>Verifikasi FC</span>
                </v-btn>
                <v-btn v-if="item.is_validate == 1 && $_sys.isAllowed('realisasi-tanam-verification-create')"
                    variant="success" small class="mt-2" @click="onVerifDetail(item, 'um')">
                    <v-icon small>mdi-check-bold</v-icon>
                    <span>Verifikasi UM</span>
                </v-btn>
                <v-btn v-if="item.is_validate == 1 && $_sys.isAllowed('realisasi-tanam-unverification-fc-create')"
                    variant="danger" small class="mt-2" @click="onUnverifDetail(item)">
                    <v-icon left small>mdi-undo</v-icon>
                    <span>Unverifikasi FC</span>
                </v-btn>
                <v-btn v-if="item.is_validate == 2 && $_sys.isAllowed('realisasi-tanam-unverification-create')"
                    variant="danger" small class="mt-2" @click="onUnverifDetail(item)">
                    <v-icon left small>mdi-undo</v-icon>
                    <span>Unverifikasi UM</span>
                </v-btn>
            </div>
        </template>


        <template v-slot:create-form>
            <planting-soc-form></planting-soc-form>
        </template>

        <template v-slot:detail-slave-raw="{ data }">
            <penilikan-tanam-detail :data="data"></penilikan-tanam-detail>
        </template>
    </geko-base-crud>
</template>

<script>
import config from './PenilikanTanamConfig.js'
import PlantingSocListFf from './PlantingSocListFF.vue'
import PlantingSocForm from './PlantingSocForm.vue'
import moment from 'moment'
import axios from 'axios'
import PenilikanTanamDetail from './PenilikanTanamDetail.vue'
import PlantingSocExportLahanMu from './PlantingSocExportLahanMu.vue'
import "./penilikan-tanam.scss";
import PlantingSocFarmerEdit from './PlantingSocFarmerEdit.vue'
import PlantingSocImportExcel from './PlantingSocImportExcel.vue'
import PlantingSocCoordinateEdit from './PlantingSocCoordinateEdit.vue'
import PlantingSocDistributionDateUpdate from './PlantingSocDistributionDateUpdate.vue'
export default {
    name: "crud-penilikan-tanam",
    components: {
        PlantingSocListFf,
        PlantingSocForm,
        PlantingSocFarmerEdit,
        PenilikanTanamDetail,
        PlantingSocExportLahanMu,
        PlantingSocImportExcel,
        PlantingSocCoordinateEdit,
        PlantingSocDistributionDateUpdate
    },
    watch: {},
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
                    program_year: 2024,
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
        async onVerif(item, type) {
            const prompt = await this.$_alert.confirm('Verifikasi Data realisasi?', 'Apakah anda yakin akan memverifikasi data realisasi ini?', 'Ya, Verifikasi', 'Batal', true)
            if (prompt.isConfirmed && type == 'fc') {
                this.verifyPenilikan(item, type);
            }
            if (prompt.isConfirmed && type == 'um') {
                this.verifyPenilikan(item, type);
            }
        },
        async onUnverif(item) {
            const prompt = await this.$_alert.confirm('Unverifikasi Data realisasi?', 'Apakah anda yakin akan mengurungkan verifikasi data realisasi ini?', 'Ya, Unverifikasi', 'Batal', true)
            // console.log('item', item)
            if (prompt.isConfirmed) {

                this.unverifyPenilikan(item);

            }
        },
        searchColumChanged(t) {
            this.searchColumn = t
            console.log('state ', this.searchColumn)
        },
        async verifyPenilikan(data, type) {

            let listTrees = [];
            data.detail_monitoring.forEach((tree) => {
                let pushData = {

                    tree_code: tree.tree_code,
                    qty: tree.qty,
                    status: tree.status,
                    condition: tree.condition,
                    planting_date: data.planting_date,
                    tree_photo: tree.tree_photo,
                    tree_description: tree.tree_description,
                };
                listTrees.push(pushData);
            });
            let temp_url = ''
            if(type == 'fc') temp_url = 'MonitoringVerificationFC'
            else if(type == 'um') temp_url = 'MonitoringVerificationUM'
            const url = `${this.$_config.baseUrl}${temp_url}`;
            const postData = {
                monitoring_no: data.monitoring_no,
                list_trees: listTrees,
                validate_by: this.$store.state.User.email,
            };

            this.$_api.post(url, postData).then(() => {
                this.$_alert.success('Penilikan tanam berhasil diverifikasi')
                this.refreshKey += 1
            })
        },
        async unverifyPenilikan(data) {

            const url = `${this.$_config.baseUrl}UnverificationMonitoring`;
            const postData = {
                monitoring_no: data.monitoring_no,
                is_validate: parseInt(data.is_validate) - 1,
            };

            this.$_api.post(url, postData).then(() => {
                this.$_alert.success('Penilikan tanam berhasil diunverifikasi')
                this.refreshKey += 1
            })
        },
        async onVerifDetail(item, type) {
            const prompt = await this.$_alert.confirm('Verifikasi Data realisasi?', 'Apakah anda yakin akan memverifikasi data realisasi ini?', 'Ya, Verifikasi', 'Batal', true)
            if (prompt) {
                await this.verifyPenilikan(item, type);
                this.$router.go(-1);
            }
        },
        async onUnverifDetail(item) {
            const prompt = await this.$_alert.confirm('Unverifikasi Data realisasi?', 'Apakah anda yakin akan mengurungkan verifikasi data realisasi ini?', 'Ya, Unverifikasi', 'Batal', true)
            if (prompt) {
                await this.unverifyPenilikan(item);
                this.$router.go(-1);
            }
        },
    },
    data() {
        return config
    },

};
</script>