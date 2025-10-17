<template>

    <v-dialog v-model="isOpen" width="40%" persistent>
        <template v-slot:default="{ isOpen }" v-if="formData">
            <v-card>
                <v-card-title class="text-center"> Perbarui Tanggal Distribusi </v-card-title>
                <v-card-text>
                    <span class="geko-input" style="position: relative;">
                        <label class="required mb-3"> Tanggal Distribusi</label>
                        <date-picker @calendar-change="onCalendarPickerChange" :disabled-date="dateDisabled"
                            title-format="YYYY-MMMM-DD" class="distribution-calendar"
                            v-model="formData.distribution_date" format="YYYY-MM-DD" type="date"
                            placeholder="Select date" inline></date-picker>
                        <v-overlay v-if="loading" absolute opacity="0.5">
                            <v-progress-circular indeterminate size="50"></v-progress-circular>
                            <span>Mengambil data bibit</span>
                        </v-overlay>
                    </span>
                    <div class="d-flex flex-row justify-content-center mt-3">
                        <v-btn variant="light" @click="onCancel">Batal</v-btn>
                        <v-btn class="ml-2" variant="warning" @click="onSubmit" :disabled="!formData.distribution_date">
                            <v-icon>mdi-calendar</v-icon>
                            <span class="ml-1">Perbarui Tanggal</span>
                        </v-btn>
                    </div>
                </v-card-text>
            </v-card>
        </template>
    </v-dialog>

</template>

<script>
import moment from "moment";
import { ref } from "vue";
export default {
    name: 'planting-soc-distribution-date-edit',
    data() {
        return {
            isOpen: false,
            formData: {},
            loading: false,
            availableDate: [],
            allocations: [],
            distribution_date: moment().format("YYYY-MM-DD"),
            disableSubmit: true,
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
        },
    },

    mounted() {
        // sostam/update/distribution-date
        // soc_no, distribution_date
    },

    methods: {
        async onOpen() {
            try {
                this.$set(this.formData, 'soc_no', await this.data.soc_no)
                // this.$set(this.formData, 'distribution_date', await this.data.distribution_date)
                // this.$set(this, 'distribution_date', await this.data.distribution_date)
                // console.log(this.data)
                this.onChangeFf(this.data);
                this.isOpen = true;

            }

            catch (err) {
                let errMessage = typeof err === 'string' ? err : 'An error occured'
                this.$_alert.error(errMessage)
            }


        },



        async onSubmit() {
            if (this.loading) return
            try {

                const updatePayload = {
                    distribution_date: moment(this.formData.distribution_date).format("YYYY-MM-DD"),
                    soc_no: this.formData.soc_no,
                    program_year: this.$store.state.tmpProgramYear
                }

                this.loading = true
                const updating = await this.$_api.post('sostam/update/distribution-date', updatePayload)
                    .catch(() => false)

                if (!updating) {
                    throw "err"
                }

                this.$_alert.success("Tanggal distribusi sostam berhasil diperbarui")
                this.$emit('success', true)
                this.isOpen = false
                this.formData = {}
                this.loading = false
            }

            catch (err) {
                this.loading = false

            }
        },
        onCalendarPickerChange(date, oldDate, type) {
            const dateDistributionNew = moment(date).format("YYYY-MM-DD");
            if (dateDistributionNew !== this.distribution_date) {
                this.disableSubmit = false;
                this.distribution_date = dateDistributionNew;
                this.onChangeFf(this.data);
            }
            console.log(date, dateDistributionNew,this.distribution_date)
        },
        getDatesBetween(start, end) {
            const dateArray = []
            const startDate = new Date(start)
            const endDate = new Date(end)

            while (startDate <= endDate) {
                // Format manual ke YYYY-MM-DD
                const year = startDate.getFullYear()
                const month = String(startDate.getMonth() + 1).padStart(2, '0')
                const day = String(startDate.getDate()).padStart(2, '0')

                dateArray.push(`${year}-${month}-${day}`)

                // tambah 1 hari
                startDate.setDate(startDate.getDate() + 1)
            }

            return dateArray
        },
        async onChangeFf(data) {
            if (!data) {
                return;
            }
            this.ffCurrent = data;
            this.availableDate = [];
            this.allocations = [];
            this.ffLahanData = [];
            this.loading = true;
            const startDate = moment(this.distribution_date, "YYYY-MM-DD")
                .startOf("month")
                .format("YYYY-MM-DD");
            const endDate = moment(this.distribution_date, "YYYY-MM-DD")
                .endOf("month")
                .format("YYYY-MM-DD");


            try {

                this.availableDate = [];

                let geko = {
                    data: [],
                    allocation_periode_days: []
                };

                geko.data = await this.$_api.get(
                    "sostam/calendar/daily-distribution-limit/get",
                    {
                        mu_no: data.mu_no,
                        program_year: this.$store.state.tmpProgramYear,
                        // start_date: startDate,
                        // end_date: endDate,
                    }
                );

                geko.data = geko.data.data.result[0] || {};
                geko.allocation_periode_days = this.getDatesBetween(
                    geko.data.start_distribution_time, 
                    geko.data.end_distribution_time
                ).map(date => {
                    return {
                        date_allocation: date,
                        qty_allocation: geko.data.wood_limitation + geko.data.mpts_limitation,
                        kayu_allocation: geko.data.wood_limitation,
                        mpts_allocation: geko.data.mpts_limitation,
                    }
                });

                let ffLahan = await this.$_api.get("getFFLahanSostamNew", {
                    ff_no: this.data.ff_no,
                    program_year: this.$store.state.tmpProgramYear,
                });
                let allocatedBibitGEKO = await this.$_api.get("/sostam/remaining-seed", {
                    month: moment(this.distribution_date).month() + 1,
                    year: moment(this.distribution_date).year(),
                    program_year: this.$store.state.tmpProgramYear,
                });
                // let [ffLahans, allocatedBibitGEKOs, nurserys] = await Promise.all([ffLahan, allocatedBibitGEKO, nursery]);
                // console.log({ffLahan}, {allocatedBibitGEKO}, {nursery});

                let totalSeedFF = {
                    kayu: 0,
                    mpts: 0,
                };
                for (const [i,farmer] of ffLahan.data.result.lahans1.entries()) {
                    totalSeedFF.kayu += parseInt(farmer.total_kayu);
                    totalSeedFF.mpts += parseInt(farmer.total_mpts);
                }

                if (geko.data) {
                    this.nurseryLocation = {
                        address_nursery: '',
                        name_location_nursery: this.$store.state.nurseries.find(n => n.id == geko.data.nursery_locations_id)?.name || '',
                        location_nursery_id: geko.data.nursery_locations_id,
                    };

                    let gekoAllocationList = geko.allocation_periode_days;
                    const off_interval = +geko.data.nursery_days_off_interval;
                    const off_amount = +geko.data.nursery_days_off_amount;

                    if (off_interval > 0 && off_amount > 0) {
                        let offIndex = this.getIndicesByInterval(off_interval, off_amount, gekoAllocationList, off_interval);
                        console.log({offIndex})
                        gekoAllocationList = gekoAllocationList.filter((_, index) => !offIndex.includes(index));
                    }

                    console.log({ geko, totalSeedFF, allocatedBibitGEKO });
                    this.allocations = gekoAllocationList.filter(
                    (gko) => {
                        let pointerGEKO = allocatedBibitGEKO.data.filter(geko => geko.distribution_date === gko.date_allocation)
                        
                        let totalBibitNeeded = {
                            kayu: totalSeedFF.kayu,
                            mpts: totalSeedFF.mpts,
                        }
                        totalBibitNeeded.kayu += (pointerGEKO.length ? pointerGEKO[0].total_seed_kayu : 0)
                        totalBibitNeeded.mpts += (pointerGEKO.length ? pointerGEKO[0].total_seed_mpts : 0)

                        let result = (parseInt(gko.kayu_allocation) - totalBibitNeeded.kayu) >= 0 && 
                        (parseInt(gko.mpts_allocation) - totalBibitNeeded.mpts) >= 0

                        console.log({totalBibitNeeded}, {totalSeedFF}, {pointerGEKO}, {gko});

                        return result;
                    });
                    for (const allocation of this.allocations) {
                        this.availableDate.push(allocation.date_allocation);
                    }
                }
                this.loading = false;

            } catch (error) {
                console.error('Error occurred:', error);
            }
        },
        getIndicesByInterval(interval, indexAmount, array, start = 0) {
            const result = [];

            while (start < array.length) {
                for (let i = 0; i < indexAmount; i++) {
                const index = start + i;
                if (index < array.length) result.push(index);
                }
                start += interval + indexAmount; // lompat ke batch berikutnya
            }

            return result;
        },
        dateDisabled(date) {
            if (this.availableDate.includes(moment(date).format("YYYY-MM-DD"))) {
                return false;
            }
            return true;
        },
        onCancel() {
            this.isOpen = false;
            this.availableDate = [];
            this.allocations = [];
            // this.formData.distribution_date = moment().format("YYYY-MM-DD");
        }
    },


    watch: {
        dataKey(t) {
            if (t > 1) {
                this.onOpen()
            }
        },
    },
}
</script>