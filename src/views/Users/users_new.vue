<template>
    <geko-base-crud :config="config" :refreshKey="refreshKey" :hideUpdate="true" :hideDelete="true" :hideCreate="true" :hideDetail="true">
        <template v-slot:list-bottom-action="{ item }">
            <v-btn variant="danger" small class="d-flex flex-row align-items-center mt-2"
                @click="onResetPassword(item)" v-if="$_sys.isAllowed('users-update')">
                <v-icon small>mdi-lock-reset</v-icon>
                <span>Reset Password!</span>
            </v-btn>
        </template>
        <template v-slot:list-before-create>
            <mass-user-reset-password :data="detailData" :dataKey="detailDataKey" @success="refreshKey = refreshKey + 1"></mass-user-reset-password>
        </template>
        <template v-slot:list-after-filter>
            <div class="d-flex flex-row justify-content-start">
                <v-btn variant="info" class="mr-2" @click="detailDataKey += 1">
                    <v-icon>mdi-lock-reset</v-icon>
                    <span>Mass Reset Password</span>
                </v-btn>
            </div>
            
        </template>
    </geko-base-crud>

</template>

<script>
import maintenanceAnimation from "@/assets/lottie/maintenance.json";
import LottieAnimation from "lottie-web-vue";
import usersConfig from "./Component/usersConfig";
import massUserResetPassword from "./Component/massUserResetPassword";

import moment from "moment";
import axios from "axios";
export default {
    components: {
        massUserResetPassword
    },
    name: "crud-users",
    watch: {},
    data() {
        return {
            user: {},
            refreshKey: 1,
            config: usersConfig,
            lottie: maintenanceAnimation,
            detailDataKey: 0,
            detailData: [],
            lableDataKey: 0,
            lableData: [],
            exportKey: 0,
        };
    },
    mounted() {
        const user = JSON.parse(localStorage.getItem("User"));
        this.user = user;
    },
    methods: {
        onResetPassword(item){
            this.detailData = item
            this.detailDataKey += 1
        },
        async onResetPassword(item){
            const prompt = await this.$_alert.confirm('Reset Password User?', 'Harap Cek Data Dengan Teliti Sebelum Melakukan Reset Password!', 'Ya, Verifikasi!', 'Batal', true)
            if (prompt.isConfirmed) {
                this.$_api.post('ResetPasswordUser', {employee_no: item.employee_no, email: item.email})
                .then(() => {
                  this.$_alert.success('Berhasil Melakukan Reset Password User!')
                  this.refreshKey += 1;
                })
            }
        },
    },
};
</script>