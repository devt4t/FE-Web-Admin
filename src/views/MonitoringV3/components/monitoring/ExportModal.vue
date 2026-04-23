<template>
    <v-dialog v-model="isOpen" width="50%">
        <v-card>
            <v-card-title>
                <span>{{ title }}</span>
            </v-card-title>

            <v-card-text class="farmer-assign-wrapper mt-3">
                <geko-input v-model="exportBy" :item="{
                    type: 'select-radio',
                    label: 'Export By',
                    validation: ['required'],
                    option: {
                        list_pointer: {
                            label: 'label',
                            code: 'code',
                            display: ['label'],
                        },
                        default_options: [
                            {
                                label: 'Field Facilitator',
                                code: 'ff',
                            },
                            {
                                label: 'Unit Management',
                                code: 'mu',
                            },
                            {
                                label: 'Target Area',
                                code: 'ta',
                            },
                        ],
                    },
                }" />

                <ValidationObserver ref="exportForm" v-slot="{ handleSubmit }">
                    <form @submit.prevent="handleSubmit(submitExport)" autocomplete="off">
                        <v-row>
                            <v-col lg="12" v-if="exportBy === 'ff'">
                                <geko-input v-model="ffNo" :item="{
                                    label: 'Field Facilitator',
                                    placeholder: 'Pilih Field Facilitator',
                                    type: 'select',
                                    validation: ['required'],
                                    api: 'GetFFAllWeb_new',
                                    param: {
                                        program_year: programYear,
                                        limit: 20,
                                    },
                                    option: {
                                        multiple: true,
                                        list_pointer: {
                                            label: 'name',
                                            code: 'ff_no',
                                            display: ['name', 'ff_no'],
                                        },
                                    },
                                }" />
                            </v-col>

                            <v-col lg="12" v-if="exportBy === 'mu'">
                                <geko-input v-model="muNo" :item="{
                                    label: 'Unit Management',
                                    placeholder: 'Pilih Unit Management',
                                    type: 'select',
                                    validation: ['required'],
                                    api: 'GetManagementUnitAdmin',
                                    param: {
                                        page: 1,
                                        per_page: 20,
                                    },
                                    option: {
                                        getterKey: 'data.result',
                                        multiple: true,
                                        list_pointer: {
                                            label: 'name',
                                            code: 'mu_no',
                                            display: ['name'],
                                        },
                                    },
                                }" />
                            </v-col>

                            <v-col lg="12" v-if="exportBy === 'ta'">
                                <geko-input v-model="targetArea" :item="{
                                    label: 'Target Area',
                                    placeholder: 'Pilih Target Area',
                                    type: 'select',
                                    validation: ['required'],
                                    api: 'GetTargetAreaAdmin',
                                    param: {
                                        page: 1,
                                        program_year: programYear,
                                        per_page: 20,
                                    },
                                    option: {
                                        getterKey: 'data.result',
                                        multiple: true,
                                        list_pointer: {
                                            label: 'name',
                                            code: 'area_code',
                                            display: ['name'],
                                        },
                                    },
                                }" />
                            </v-col>

                            <v-col lg="12">
                                <v-btn color="success" type="submit" :disabled="loadingExport">
                                    <v-icon v-if="!loadingExport">mdi-microsoft-excel</v-icon>
                                    <v-progress-circular v-else :size="20" indeterminate />
                                    <span class="ml-1">Export Excel</span>
                                </v-btn>
                            </v-col>
                        </v-row>
                    </form>
                </ValidationObserver>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
import axios from 'axios'

export default {
    name: 'monitoring-v3-export-modal',

    props: {
        dataKey: {
            required: false,
            default: false,
        },
        programYear: {
            required: true,
        },
        currentYear: {
            required: true,
        },
        monitoringStep: {
            required: true,
        },
        exportType: {
            required: false,
            default: 'detail',
        },
        endpoint: {
            required: false,
            default: 'v2/export/monitoring-v3/excel',
        },
        title: {
            required: false,
            default: 'Export Monitoring V3',
        },
    },

    data() {
        return {
            isOpen: false,
            loadingExport: false,
            exportBy: 'ff',
            ffNo: [],
            muNo: [],
            targetArea: [],
        }
    },

    watch: {
        dataKey(val) {
            if (val) this.isOpen = true
        },

        exportBy() {
            this.resetFilters()
        },

        isOpen(val) {
            if (!val) this.resetState()
        },
    },

    methods: {
        resetFilters() {
            this.ffNo = []
            this.muNo = []
            this.targetArea = []
        },

        resetState() {
            this.resetFilters()
            this.loadingExport = false
        },

        buildPayload() {
            return {
                program_year: this.programYear,
                current_year: this.currentYear,
                monitoring_step: this.monitoringStep,
                export_type: this.exportType,
                exportBy: this.exportBy,
                ff_no: this.exportBy === 'ff' ? this.ffNo : null,
                mu_no: this.exportBy === 'mu' ? this.muNo : null,
                target_area: this.exportBy === 'ta' ? this.targetArea : null,
                token: localStorage.getItem('token'),
            }
        },

        async submitExport() {
            if (this.loadingExport) return

            if (!this.programYear || !this.currentYear || !this.monitoringStep) {
                this.$_alert.error({}, 'Filter tahun monitoring belum lengkap')
                return
            }

            this.loadingExport = true

            try {
                const response = await axios({
                    method: 'POST',
                    url: `${this.$_config.baseUrlExport}${this.endpoint}`,
                    responseType: 'arraybuffer',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                    data: this.buildPayload(),
                })

                this.downloadFile(response)
                this.$_alert.success('Export success')
                this.isOpen = false
            } catch (err) {
                console.error(err)
                this.$_alert.error({}, 'Export failed')
            } finally {
                this.loadingExport = false
            }
        },

        getFilename(response) {
            const contentDisposition = response.headers['content-disposition']

            if (!contentDisposition) return `export-monitoring-v3-${this.exportType}.xlsx`

            const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/)
            return filenameMatch && filenameMatch[1]
                ? filenameMatch[1]
                : `export-monitoring-v3-${this.exportType}.xlsx`
        },

        downloadFile(response) {
            const blob = new Blob([response.data], {
                type: response.headers['content-type'],
            })
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')

            link.href = url
            link.download = this.getFilename(response)

            document.body.appendChild(link)
            link.click()
            window.URL.revokeObjectURL(url)
            document.body.removeChild(link)
        },
    },
}
</script>
