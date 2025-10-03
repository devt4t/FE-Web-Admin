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
            disableSubmit: true
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
                    distribution_date: this.formData.distribution_date,
                    soc_no: this.formData.soc_no,
                    program_year: this.$_config.programYear.model
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
            console.log(date)
            const dateDistributionNew = moment(date).format("YYYY-MM-DD");
            if (dateDistributionNew !== this.distribution_date) {
                this.disableSubmit = false;
                this.distribution_date = dateDistributionNew;
                this.onChangeFf(this.data);
            }
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
                let nursery = await this.$_api.getNursery(
                    "custom/gekoDistributionAllocationPeriodes",
                    {
                        mu_no: data.mu_no,
                        program_year: this.$_config.programYear.model,
                        start_date: startDate,
                        end_date: endDate,
                    }
                );
                let ffLahan = await this.$_api.get("getFFLahanSostamNew", {
                    ff_no: this.data.ff_no,
                    program_year: this.$_config.programYear.model,
                });
                let bibitGEKO = await this.$_api.get("/sostam/remaining-seed", {
                    month: moment(this.distribution_date).month() + 1,
                    year: moment(this.distribution_date).year(),
                    program_year: this.$_config.programYear.model,
                });
                // let [ffLahans, bibitGEKOs, nurserys] = await Promise.all([ffLahan, bibitGEKO, nursery]);
                // console.log(ffLahans, bibitGEKOs, nurserys);

                let totalSeedFF = 0;
                for (const farmer of ffLahan.data.result.lahans) {
                    totalSeedFF += parseInt(farmer.total_kayu) + parseInt(farmer.total_mpts);
                }

                if (Array.isArray(nursery.data) && nursery.data.length > 0) {
                    this.nurseryLocation = {
                        address_nursery: nursery.data[0].address_nursery,
                        name_location_nursery: nursery.data[0].name_location_nursery,
                        location_nursery_id: nursery.data[0].location_nursery_id,
                    };

                    const nurseryAllocationList = nursery.data[0].allocation_periode_days;
                    console.log({ nurseryAllocationList })
                    this.allocations = nurseryAllocationList.filter(
                        (nursery) => {
                            let pointerGEKO = bibitGEKO.data.filter(geko => geko.distribution_date === nursery.date_allocation)
                            console.log({ pointerGEKO })
                            if (pointerGEKO.length) {
                                console.log(parseInt(nursery.qty_allocation), pointerGEKO[0].total_seed, totalSeedFF)
                                let result = parseInt(nursery.qty_allocation) - (pointerGEKO[0].total_seed + totalSeedFF);
                                console.log({ result })
                                return result > 0
                            } else {
                                return 1
                            }
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