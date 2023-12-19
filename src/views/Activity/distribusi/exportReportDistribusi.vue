<template>
    <v-dialog
        v-model="showModal"
        scrollable
        max-width="2500px"
        transition="dialog-transition"
        content-class="rounded-xl"
        >
        <v-card>
            <v-card-title class="rounded-xl green darken-3 ma-1 pa-2 white--text">
                <v-icon color="white" class="mx-2">mdi-account-details</v-icon> Export Report Data FF
                <v-icon color="white" class="ml-auto" @click="showModal = false">mdi-close-circle</v-icon>
            </v-card-title>
            <v-card-text>
                    <!-- Loading -->
                    <v-overlay absolute :value="table.loading.show" class="rounded-xl">
                        <div class="d-flex flex-column justify-center align-center">
                            <p class="mt-2 mb-0"> {{table.loading.text}}
                                <v-progress-circular
                                    :size="17"
                                    :width="3"
                                    indeterminate
                                    color="white"
                                >
                                </v-progress-circular>
                            </p>
                        </div>
                    </v-overlay>
    
                <table
                    id="tabelForExportReportDistribusi"
                    
                    style="border: 2px solid black;border-collapse: collapse; min-height: 200px"
                >
                    <tr>
                        <th :colspan="table.headers.length + statusTree.length " align="center" style="text-align: center;font-size: 15px;">
                            Tahun Program: {{ this.program_year }}</th>
                    </tr>
                    <tr>
                        <td :colspan="table.headers.length + statusTree.length" style="text-align: center;">
                            <small>
                                Export Time: {{ Date() }}
                            </small>
                        </td>
                    </tr>
                    <tr><td :colspan="table.headers.length + statusTree.length"></td></tr>
                    <tr style="border: 2px solid black;border-collapse: collapse;">
                        <th v-for="(header, headerIndex) in table.headers" :key="`tabelForExportReportDistribusi${headerIndex}`" class="green darken-2 white--text justify-center align-center" rowspan="2">
                            {{ header.text }}
                        </th>
                        
                        <th v-for="(header, headerIndex) in table.headersTree" :key="`tabelForExportReportDistribusitree${headerIndex}`" class="green darken-2 white--text justify-center align-center" colspan="5">
                            {{ header.text }}
                        </th>
                    </tr>
                    <tr style="border: 2px solid black;border-collapse: collapse;">
                        <th v-for="(n, nIndex) in statusTree" :key="`itemTreeExportReport-${nIndex}`" class="green white--text">
                            {{ n.text}}
                        </th>
                    </tr>
                    <tr v-for="(tableData, tableDataIndex) in table.items" :key="`itemtableForExportLahanPetaniDashboard${tableDataIndex}`" :class="`${tableDataIndex % 2 == 0 ? 'white' : 'grey'} justify-center align-center lighten-4 `" style="text-align: center; " >
                            <td v-for="(itemTable, itemTableIndex) in table.headers" :key="`tableItemForExportSostambyFC${itemTableIndex}-${tableDataIndex}`" 
                            
                            style="border: 1px solid black;border-collapse: collapse;"
                            >
                                <span v-if="itemTable.value == 'index'">
                                        {{ tableDataIndex + 1 }}
                                </span>
                                <span v-if="itemTable.value == 'mu_name'">
                                    {{ tableData.loading_line[0].mu_name }}
                                </span>
                                <span v-else-if="itemTable.value == 'ff_name'">
                                    {{ tableData.loading_line[0].ff_name }}
                                </span>
                                <span v-else-if="table.trees.find(v => itemTable.value == v.tree_code)">
                                    
                                    <!-- {{ tableData.detail_seed_farmers.find(v=> v.tree_code == itemTable.value) }} -->


                                </span>
                                <span v-else>
                                    {{ tableData[itemTable.value] }}
                                </span>
                            </td>
                            <td v-for="(n, nIndex) in statusTree" :key="`tableItemForExportSostambyFC-${nIndex}-${tableDataIndex}`" 
                            :class=" getSeedColor(n, tableData)">
                                {{ getSeedAmount(n, tableData) }} 
                            </td>
                        </tr>
                        
                
                    </table>
                
            </v-card-text>
            
            <v-card-actions class="justify-center align-center">
                    <v-btn :disabled="table.loading.show" color="green white--text" rounded @click="downloadExcel()"><v-icon class="mr-1">mdi-microsoft-excel</v-icon> Unduh Excel</v-btn>
                    <v-btn :disabled="table.loading.show" color="orange darken-2 white--text" rounded @click="downloadPDF()"><v-icon class="mr-1">mdi-file-pdf-box</v-icon> Unduh PDF</v-btn>
                </v-card-actions>
        </v-card>
    </v-dialog>
    
    </template>
    
    <script>
    
    import axios from 'axios'
    import moment from 'moment'
    import Swal from 'sweetalert2'
    export default {
        
        props: {
            show: {
                type: Boolean,
                default: false,
            },
            ff_no: {
                type: String,
                default: ''
            },
            distribution_date:{
                type: String,
                default: ''
            },
            program_year: {
                type: String,
                default: ''
            }
        },
        data: () => ({
            statusTree: [],
            totalData : 0,
            totalBibitKayu : 0,
            data_um_name: '',
            data_fc_name: '',

    
            table: {
                trees: [],
                headers: [
                    {text: 'No', value: 'index', width: 75},
                    {text: 'Management Unit', value: 'mu_name'},
                    {text: 'Nama FF', value: 'ff_name'},
                    {text: 'Nama Petani', value: 'farmer_name'},
                ],
                headersTree: [],
                items: [],
                items_raw: [],
                loading: {
                    show: false,
                    text: 'Loading...'
                },
                search: ''
            }
        }),
        computed: {
            showModal: {
                get: function () {
                    if(this.show){
                     
                        this.getTableData()   
                    }
                    return this.show
                },
                set: function(newVal) {
                    if (!newVal) {
                        setTimeout(() => {
                            this.table.items = []
                            this.table.items_raw = []
                        }, 200);
                        this.$emit('close', false)
                    }else{
                    }
                }
            },
        },
    
    methods: {
        resetParams(){
            this.ff_no = ''
            this.distribution_date= ''
            this.program_year= ''
        },
        downloadExcel() {
            const table = document.getElementById("tabelForExportReportDistribusi");
            const wb = XLSX.utils.table_to_book(table);
    
            /* Export to file (start a download) */
            XLSX.writeFile(wb, `DataReportDistribusi-${this.program_year}_FF-${this.um_no}_FC-${this.fc_no}.xlsx`);
        },
        downloadPDF() {
            window.jsPDF = window.jspdf.jsPDF;
            var doc = new jsPDF({
                orientation: 'landscape',
                unit: 'px',
                format: [4500, 700]
            });
            doc.autoTable({ 
                html: '#tabelForExportReportDistribusi',
                useCss: true,
                tableLineWidth: 0,
                theme: 'striped'
             })
            //  console.log(doc)
            doc.save(`DataReportDistribusi-${this.program_year}_FF-${this.ff_no}_FC-${this.fc_no}.pdf`);
        },
        getSeedAmount(item, data){
            const total_column = item.value.split('-')
            const tree_seed = data.detail_seed_farmers.find(v =>v.tree_code == total_column[0])
            // console.log(data.detail_seed_farmers)
            if(tree_seed){
                return tree_seed[total_column[1]] || 0
            }
            else return 0
        },
        getSeedColor(n, tableData){
            const total = this.getSeedAmount(n, tableData)
            // console.log(n)
            let treeBgColor = ''

            if(total > 0){
                if(n.value.includes('total_load')){treeBgColor = 'blue'}
                else if(n.value.includes('total_damaged')){treeBgColor = 'orange'}
                else if(n.value.includes('total_missing')){treeBgColor = 'red'}
                else if(n.value.includes('total_reject')){treeBgColor = 'red'}
                else if(n.value.includes('received')){treeBgColor = 'green'}
                return `${treeBgColor} white--text`
            }
        },
        async errorResponse(error) {
                console.log(error)
                if (error.response) {
                    if (error.response.status) {
                        if (error.response.status == 401) {
                            const confirm = await Swal.fire({
                                title: 'Session Ended!',
                                text: "Please login again.",
                                icon: 'warning',
                                confirmButtonColor: '#2e7d32',
                                confirmButtonText: 'Okay'
                            })
                            if (confirm) {
                                localStorage.removeItem("token");
                                this.$router.push("/");
                            }
                        }
                        if (error.response.status === 500 || error.response.status === 400) {
                            let errMessage = error.response.data.message
                            if (errMessage) if (errMessage.includes("Duplicate entry")) errMessage = 'Error!' 
                            Swal.fire({
                                title: 'Error!',
                                text: `${errMessage || error.message}`,
                                icon: 'error',
                                confirmButtonColor: '#f44336',
                            })
                        }
                    }
                }
            },
            async getTableData() {
                try {
                    this.table.loading.show = true
                    const params = {
                        limit: 100,
                        ff_no: this.ff_no,
                        distribution_date: this.distribution_date,
                        program_year: this.program_year
                    }
                    const url = `https://api-nursery.t4t-api.org/api/custom/reportDetailFarmer?${params}`
                    const treeUrl = `GetTreesLocation`
                    const res = await axios.get(
                        url,
                        {
                            headers: {
                                Authorization: `Bearer ` + 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC8xMjcuMC4wLjE6ODAwMFwvYXBpXC9sb2dpbiIsImlhdCI6MTY5NjMxNzExMiwiZXhwIjoxNzI3NDIxMTEyLCJuYmYiOjE2OTYzMTcxMTIsImp0aSI6IkNzSHRmb0ltOFMzdnNKRUgiLCJzdWIiOjEsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.5yw7p18qzA4VLVi6Ea0ToA5NO90vgUOsE46uZrHhdBw'
                            },
                            params: params
                        }
                    ).catch(err => {
                        this.sessionEnd(err)
                        this.distributionReport.table.loading = false
                    })
                    const resTree = await axios.get(
                        this.$store.getters.getApiUrl(treeUrl), this.$store.state.apiConfig)
                        const unique = [...new Set(resTree.data.data.result.data.sort((a,b) => a.tree_name.localeCompare(b.tree_name)).map(item => item.tree_code))];

                    this.table.trees = unique.map(val=>
                    {
                        const findKey = resTree.data.data.result.data.find(v=>v.tree_code == val)
                        this.table.headersTree.push({
                            text: findKey.tree_name,
                            value: findKey.tree_code
                        })
                        const subheader = [{text: 'Dimuat', value: 'total_load'},
                        {text: 'Rusak', value: 'total_damaged'},
                        {text: 'Ditolak', value: 'total_reject'},
                        {text: 'Diterima', value: 'total_received'},
                        {text: 'Hilang', value: 'total_missing'}]
                        subheader.map( v => {
                            this.statusTree.push({
                            text: v.text,
                            value: findKey.tree_code+'-'+v.value
                        })
                        })
                        return val
                    })

                    const data = res.data.data
                    
                    // this.table.trees = treeData
                    this.table.items = data
                    this.table.items_raw = data
                } catch (err) {this.errorResponse(err)} finally {
                    this.table.loading.show = false
                }
            }

        }
    
    }
    </script>