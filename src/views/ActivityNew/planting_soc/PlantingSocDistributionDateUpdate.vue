<template>

    <v-dialog v-model="isOpen" width="75%">
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
                        <v-btn variant="warning" @click="onSubmit">
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
export default {
    name: 'planting-soc-distribution-date-edit',
    data() {
        return {
            isOpen: false,
            formData: {},
            loading: false,
            availableDate: [],
            allocations: [],
            distribution_date: moment().format("YYYY-MM-DD")
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
        // sostam/update/distribution-date
        // soc_no, distribution_date
    },

    methods: {
        async onOpen() {
            try {
                this.$set(this.formData, 'soc_no', await this.data.soc_no)
                // this.$set(this.formData, 'distribution_date', await this.data.distribution_date)
                // this.$set(this, 'distribution_date', await this.data.distribution_date)

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
                    soc_no: this.formData.soc_no
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
            const response = await this.$_api.getNursery(
                "custom/gekoDistributionAllocationPeriodes",
                {
                    mu_no: data.mu_no,
                    program_year: this.$_config.programYear.model,
                    start_date: startDate,
                    end_date: endDate,
                }
            );

            if (Array.isArray(response.data) && response.data.length > 0) {
                this.nurseryLocation = {
                    address_nursery: response.data[0].address_nursery,
                    name_location_nursery: response.data[0].name_location_nursery,
                    location_nursery_id: response.data[0].location_nursery_id,
                };

                const allocationList = response.data[0].allocation_periode_days;

                this.allocations = allocationList.filter(
                    (x) => parseInt(x.qty_allocation) > 0
                );
                for (const allocation of this.allocations) {
                    this.availableDate.push(allocation.date_allocation);
                }
            }
            this.loading = false;
        },
        dateDisabled(date) {
            if (this.availableDate.includes(moment(date).format("YYYY-MM-DD"))) {
                return false;
            }
            return true;
        },
        onCancel(){
            this.isOpen = false;
            this.availableDate = [];
            this.allocations = []
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