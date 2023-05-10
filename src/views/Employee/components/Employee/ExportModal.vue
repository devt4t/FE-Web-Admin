<template>
    <v-dialog v-model="showModal"
        content-class="rounded-xl mx-1"
        max-width="800px"
        scrollable
        persistent
    >
        <v-card>
            <v-card-title class="mb-1 headermodalstyle rounded-xl">
                <span class="white--text"><v-btn class="white dark--text mr-1" fab x-small><v-icon color="grey darken-3">mdi-file-account</v-icon></v-btn> Employees Export Excel Preview</span>
                <v-icon color="red lighten-1" class="ml-auto" @click="showModal = false">mdi-close-circle</v-icon>
            </v-card-title>
            <v-card-text>
                <!-- Loading -->
                <v-overlay absolute :value="loading.show">
                    <div class="d-flex flex-column"></div>
                    <v-progress-circular
                    :size="80"
                    :width="10"
                    indeterminate
                    color="white"
                    >
                    </v-progress-circular>
                    <p class="mt-2 mb-0">{{ loading.text }}</p>
                </v-overlay>
                <!-- Table Preview -->
                <table id="tableForExport" style="border-collapse: collapse;">
                    <thead>
                        <tr>
                            <th colspan="8" style="text-align: left;">Employees</th>
                        </tr>
                        <tr>
                            <td colspan="8" style="text-align: left;">Export Time: {{ Date() }}</td>
                        </tr>
                        <tr></tr>
                        <tr>
                            <th>No</th>
                            <th>ID Karyawan (GEKO)</th>
                            <th>Nama</th>
                            <th>Email</th>
                            <th>Posisi</th>
                            <th>NIK</th>
                            <th>No HP</th>
                            <th>Tgl Lahir</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(e, i) in data" :key="i">
                            <td>{{ i + 1 }}</td>
                            <td>{{ e.nik }}</td>
                            <td>{{ e.name }}</td>
                            <td>{{ e.email }}</td>
                            <td>{{ e.emp_position }}</td>
                            <td>'{{ e.ktp_no }}</td>
                            <td>'{{ e.phone }}</td>
                            <td>{{ e.birthday }}</td>
                        </tr>
                    </tbody>
                </table>
            </v-card-text>
            <v-card-actions>
                <v-divider class="mr-2"></v-divider>
                <v-btn color="blue white--text" rounded @click="() => download()"><v-icon>mdi-download</v-icon> Download</v-btn>
                <v-divider class="ml-2"></v-divider>
            </v-card-actions>
        </v-card>
    </v-dialog>
    
</template>

<script>
export default {
    props: {
        show: {
            type: Boolean,
            default: false
        },
        data: {
            type: Array,
            default: []
        }
    },
    data: () => ({
        loading: {
            show: false,
            text: ''
        }
    }),
    computed: {
        showModal: {
            get: function () {
                return this.show
            },
            set: function(newVal) {
                if (newVal == false) this.$emit('close')
            }
        }
    },
    methods: {
        download() {
            const table = document.getElementById("tableForExport");
            const wb = XLSX.utils.table_to_book(table);

            /* Export to file (start a download) */
            XLSX.writeFile(wb, "SheetJSTable.xlsx");
        }
    }
}
</script>