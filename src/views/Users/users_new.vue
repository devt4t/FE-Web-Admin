<template>
    <div>
        <geko-base-crud :config="config" :refreshKey="refreshKey" :hideUpdate="true" :hideDelete="false"
            :hideCreate="true" :hideDetail="false">
            <template v-slot:list-before-create>
                <mass-user-reset-password :data="detailData" :dataKey="detailDataKey"
                    @success="refreshKey = refreshKey + 1"></mass-user-reset-password>
            </template>
            <template v-slot:list-after-filter>
                <div class="d-flex flex-row justify-content-between">
                    <v-btn color="info" class="mr-2" @click="detailDataKey += 1">
                        <v-icon>mdi-lock-reset</v-icon>
                        <span>Mass Reset Password</span>
                    </v-btn>

                    <v-btn color="success" @click="openAddModal" v-if="$_sys.isAllowed('user-create')">
                        <v-icon small>mdi-plus</v-icon>
                        <span class="ms-2">Tambah Data Baru</span>
                    </v-btn>
                </div>
                <!-- ==== -->
            </template>
            <template v-slot:list-action-extra="{ item }">
                <button class="geko-list-action-update" style="background-color: #dc3545;"
                    @click="onResetPassword(item)" title="Reset Password">
                    <v-icon small style="color: white; margin-bottom: 2px;">mdi-lock-reset</v-icon>
                </button>
            </template>

            <template v-slot:list-action-detail="{ item }">
                <button class="geko-list-action-view" @click="openCustomDetailModal(item)" title="Detail">
                    <v-icon small>mdi-information-outline</v-icon>
                </button>
            </template>
        </geko-base-crud>
        <!-- editanku -->
        <v-dialog v-model="showModalDetail" max-width="600px">
            <v-card>
                <v-card-title class="headline text-gray font-bold">
                    Detail Informasi User
                </v-card-title>

                <v-card-text class="pt-4">
                    <!-- Kamu bisa panggil komponen khusus, atau buat struktur UI simpel di sini -->
                    <v-row>
                        <v-col cols="12" md="6">
                            <p class="text-gray mb-0">Kode Karyawan</p>
                            <p class="font-weight-bold">{{ selectedUserDetail.employee_no }}</p>
                        </v-col>
                        <v-col cols="12" md="6">
                            <p class="text-gray mb-0">Nama Lengkap</p>
                            <p class="font-weight-bold">{{ selectedUserDetail.name }}</p>
                        </v-col>
                        <v-col cols="12">
                            <p class="text-gray mb-0">Email</p>
                            <p class="font-weight-bold">{{ selectedUserDetail.email }}</p>
                        </v-col>
                        <v-col cols="12">
                            <p class="text-gray mb-0">Role / Posisi</p>
                            <p class="font-weight-bold text-uppercase badge bg-info">{{ selectedUserDetail.role }}</p>
                        </v-col>
                    </v-row>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <!-- Tombol Tutup -->
                    <v-btn color="grey" @click="closeCustomDetailModal">
                        Tutup
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="showModalAdd" max-width="800px" persistent>
            <v-card>
                <!-- Form kamu yang sudah ada sebelumnya dimasukkan ke dalam v-card ini -->
                <v-form ref="form" v-model="valid" lazy-validation>
                    <v-card-title class="headline bg-success">
                        <span class="headline">Tambah Data User</span>
                    </v-card-title>
                    <v-card-text class="pt-4">
                        <v-container>
                            <v-row>
                                <v-col cols="12" sm="6" md="6">
                                    <v-text-field v-model="defaultItem.name" label="Nama" :rules="rules"></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6" md="6">
                                    <v-text-field v-model="defaultItem.email" label="Email"
                                        :rules="emailRules"></v-text-field>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="12" sm="6" md="6">
                                    <v-select v-model="defaultItem.type" :items="itemsType" item-value="value"
                                        item-text="text" label="Pilih Tipe" v-on:change="selectedType"
                                        :rules="rules"></v-select>
                                </v-col>
                                <v-col v-if="typeselectedFF == true" cols="12" sm="8" md="8">
                                    <v-autocomplete v-model="defaultItem.employee_no" :items="itemsFF"
                                        item-value="ff_no" item-text="namaFF" label="Pilih FF"
                                        clearable></v-autocomplete>
                                </v-col>
                                <v-col v-if="typeselectedFF == false" cols="12" sm="8" md="8">
                                    <v-autocomplete v-model="defaultItem.employee_no" :items="itemsEmp" item-value="nik"
                                        item-text="name" label="Pilih Employee" clearable></v-autocomplete>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-card-text>
                    <v-card-actions class="pb-4 pr-4">
                        <v-spacer></v-spacer>
                        <v-btn color="grey darken-1" text @click="closeAddModal">
                            Batal
                        </v-btn>
                        <v-btn color="success" @click="onAddUser">
                            Tambah User Baru
                        </v-btn>
                    </v-card-actions>
                </v-form>
            </v-card>
        </v-dialog>
    </div>


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
            // editanku
            showModalDetail: false,
            selectedUserDetail: {},
            showModalAdd: false,
            defaultItem: {},
            valid: true,
            rules: [
                (value) => !!value || "Wajib diisi.",
                (value) => (value && value.length >= 1) || "Min 1 karakter",
            ],
            emailRules: [
                (value) => !!value || "Email wajib diisi.",
                (value) => /.+@.+\..+/.test(value) || "Format email tidak valid.",
                (value) => (value && value.endsWith('@trees4trees.org')) || "Email harus menggunakan domain @trees4trees.org",
            ],
            itemsType: [
                { text: "FF", value: "FF" },
                { text: "Karyawan", value: "Employee" },
            ],
            itemsEmp: [],
            itemsFF: [],
            itemsPositionEmp: [],
            typeselectedFF: true,
            typeAdd: true,
            authtoken: "",
            BaseUrlGet: "",
            // ====
        };
    },
    mounted() {
        const user = JSON.parse(localStorage.getItem("User"));
        this.user = user;

        this.authtoken = localStorage.getItem("token");
        this.BaseUrlGet = localStorage.getItem("BaseUrlGet");

        this.GetEmp();
        this.GetFF();
        this.GetJobPosition();
    },
    methods: {
        // onResetPassword(item) {
        //     this.detailData = item
        //     this.detailDataKey += 1
        // },
        // async onResetPassword(item) {
        //     const prompt = await this.$_alert.confirm('Reset Password User?', 'Harap Cek Data Dengan Teliti Sebelum Melakukan Reset Password!', 'Ya, Verifikasi!', 'Batal', true)
        //     if (prompt.isConfirmed) {
        //         this.$_api.post('ResetPasswordUser', { employee_no: item.employee_no, email: item.email })
        //             .then(() => {
        //                 this.$_alert.success('Berhasil Melakukan Reset Password User!')
        //                 this.refreshKey += 1;
        //             })
        //     }
        // },

        // editanku

        openCustomDetailModal(item) {
            this.selectedUserDetail = item;
            this.showModalDetail = true;
        },

        closeCustomDetailModal() {
            this.showModalDetail = false;
            this.selectedUserDetail = {};
        },

        async onResetPassword(item) {
            const prompt = await this.$_alert.confirm('Reset Password User?', 'Harap Cek Data Dengan Teliti sebelum Reset Password!', 'Ya, Reset Password', 'Batal', true)
            if (prompt.isConfirmed) {
                this.$_api.post('ResetPasswordUser', { employee_no: item.employee_no, email: item.email })
                    .then(() => {
                        this.$_alert.success('Berhasil Reset Password User!')
                        this.refreshKey += 1;
                    }).catch((err) => {
                        this.$_alert.error('Gagal Reset Password User!')
                    })
            }
        },

        async onAddUser() {
            this.$refs.form.validate();

            if (this.defaultItem.name.length != 0 && this.defaultItem.type != null && this.defaultItem.employee_no != null && this.defaultItem.email.length != 0) {

                const prompt = await this.$_alert.confirm('Tambah Data User?', 'Harap Cek Data Dengan Teliti Sebelum Menambahkan Data!', 'Ya, Tambah Data', 'Batal', true)
                if (prompt.isConfirmed) {

                    const datapost = {
                        employee_no: this.defaultItem.employee_no,
                        name: this.defaultItem.name,
                        email: this.defaultItem.email,
                        password: "123456",
                        role: this.defaultItem.type,
                    };

                    this.$_api.post('Regist', datapost)
                        .then(() => {
                            this.$_alert.success('Berhasil Menambahkan Data User!')
                            this.showModalAdd = false;
                            this.refreshKey += 1;
                        }).catch((err) => {
                            this.$_alert.error('Gagal Menambahkan Data User!')
                        })
                }
            } else {
                this.$_alert.error('Gagal Simpan, Semua kolom tidak boleh ada yang kosong');
            }
        },


        openAddModal() {
            this.showModalAdd = true;
        },

        closeAddModal() {
            this.showModalAdd = false;
            this.defaultItem = {};
        },

        // 1. Fungsi Ganti Tipe FF vs Karyawan
        selectedType(a) {
            if (a == "FF") {
                this.typeselectedFF = true;
                this.defaultItem.type = a;
            } else {
                this.typeselectedFF = false;
                this.defaultItem.type = a;
            }
        },
        // 2. Fungsi Mengambil Data Karyawan
        async GetEmp() {
            try {
                const response = await axios.get(this.BaseUrlGet + "GetEmployeeAll", {
                    headers: {
                        Authorization: `Bearer ` + this.authtoken,
                    },
                });
                if (response.data.length != 0) {
                    this.itemsEmp = response.data.data.result.data;
                } else {
                    this.itemsEmp = [];
                }
            } catch (error) {
                console.error(error);
                if (error.response && error.response.status == 401) {
                    localStorage.removeItem("token");
                    this.$router.push("/");
                } else {
                    this.itemsEmp = [];
                }
            }
        },
        // 3. Fungsi Mengambil Data Field Facilitator (FF)
        async GetFF() {
            try {
                const response = await axios.get(
                    this.BaseUrlGet + "GetFieldFacilitatorAllWeb",
                    {
                        headers: {
                            Authorization: `Bearer ` + this.authtoken,
                        },
                    }
                );
                if (response.data.length != 0) {
                    this.itemsFF = response.data.data.result.data;
                } else {
                    this.itemsFF = [];
                }
            } catch (error) {
                console.error(error);
                if (error.response && error.response.status == 401) {
                    localStorage.removeItem("token");
                    this.$router.push("/");
                } else {
                    this.itemsFF = [];
                }
            }
        },
        // 4. Fungsi Posisi
        async GetJobPosition() {
            try {
                const response = await axios.get(this.BaseUrlGet + "GetJobPosition", {
                    headers: {
                        Authorization: `Bearer ` + this.authtoken,
                    },
                });
                if (response.data.length != 0) {
                    this.itemsPositionEmp = response.data.data.result.data;
                } else {
                    this.itemsPositionEmp = [];
                }
            } catch (error) {
                console.error(error);
                if (error.response && error.response.status == 401) {
                    localStorage.removeItem("token");
                    this.$router.push("/");
                } else {
                    this.itemsPositionEmp = [];
                }
            }
        },
    },
};
</script>