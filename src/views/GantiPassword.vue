<template>
  <div>
    <v-breadcrumbs
      class="breadcrumbsmain"
      :items="itemsbr"
      divider=">"
      large
    ></v-breadcrumbs>

    <v-form ref="form" v-model="valid" lazy-validation>
      <v-card elevation="2" class="mx-auto my-1 px-1" max-width="500">
        <v-card-text>
          <v-text-field
            v-model="oldpassword"
            label="Password Lama"
            :type="showPassword ? 'text' : 'password'"
            prepend-icon="mdi-lock"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="showPassword = !showPassword"
            :rules="[(v) => !!v || 'Field is required']"
          />
          <v-text-field
            v-model="newpassword"
            label="Password Baru"
            :type="showPassword ? 'text' : 'password'"
            prepend-icon="mdi-lock"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="showPassword = !showPassword"
            :rules="[(v) => !!v || 'Field is required']"
          />
          <v-text-field
            v-model="confirmpassword"
            label="Konfirmasi Password"
            :type="showPassword ? 'text' : 'password'"
            prepend-icon="mdi-lock"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="showPassword = !showPassword"
            :rules="[(v) => !!v || 'Field is required']"
          />
        </v-card-text>

        <v-divider></v-divider>
        <v-card-actions>
          <v-btn
            width="200"
            @click="gantipassword()"
            color="info"
            class="mx-auto"
            >Ganti Password</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-form>

    <v-snackbar
      v-model="snackbar"
      :color="colorsnackbar"
      :timeout="timeoutsnackbar"
    >
      {{ textsnackbar }}
    </v-snackbar>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "GantiPassword",
  data: () => ({
    showPassword: false,
    itemsbr: [
      {
        text: "Profile",
        disabled: true,
        href: "breadcrumbs_profile",
      },
      {
        text: "Ganti Password",
        disabled: true,
        href: "breadcrumbs_ganti_password",
      },
    ],
    authtoken: "",
    BaseUrlGet: "",
    dataobjectprov: [],
    defaultItem: { id: "", province_code: "", name: "" },
    snackbar: false,
    textsnackbar: "Test",
    timeoutsnackbar: 2000,
    colorsnackbar: null,
    valid: true,

    User: [],

    namauser: "",
    emailuser: "",
    oldpassword: "",
    newpassword: "",
    confirmpassword: "",
  }),

  created() {
    this.authtoken = localStorage.getItem("token");
    this.User = JSON.parse(localStorage.getItem("User"));
    this.BaseUrlGet = localStorage.getItem("BaseUrlGet");
    if (this.User) {
      this.emailuser = this.User.email;
      this.namauser = this.User.name;
    }
  },

  methods: {
    async submitgantipassword() {
      const datapost = {
        name: this.namauser,
        email: this.emailuser,
        password: this.oldpassword,
        new_password: this.newpassword,
        confirm_password: this.confirmpassword,
      };

      try {
        const response = await axios.post(
          this.BaseUrlGet + "EditProfile",
          datapost,
          {
            headers: {
              Authorization: `Bearer ` + this.authtoken,
            },
          }
        );
        console.log(response.data.data.status.code);
        this.snackbar = true;
        if (response.data.data.status.code == 200) {
          this.colorsnackbar = "green";
          this.textsnackbar = "Sukses Ganti Password";
          this.cekLogout();
        } else {
          this.colorsnackbar = "red";
          this.textsnackbar = "Gagal ganti password";
        }
      } catch (error) {
        console.error(error.response);
        this.snackbar = true;
        this.colorsnackbar = "red";
        this.textsnackbar = error.response.data.data.status.description;
      }
    },
    async cekLogout() {
      const datapost = {};
      // console.log(this.BaseUrlGet);
      // console.log(this.authtoken);
      // this.dialogDetail = false;
      try {
        const response = await axios.post(
          this.BaseUrlGet + "Logout",
          datapost,
          {
            headers: {
              Authorization: `Bearer ` + this.authtoken,
            },
          }
        );
        console.log(response.data.data.status.code);
        if (response.data.data.status.code == 200) {
          localStorage.removeItem("token");
          localStorage.removeItem("User");
          localStorage.removeItem("BaseUrlUpload");
          this.$router.push("/");
        } else {
          localStorage.removeItem("token");
          localStorage.removeItem("User");
          localStorage.removeItem("BaseUrlUpload");
          this.$router.push("/");
        }
      } catch (error) {
        // console.error(error.response);
        localStorage.removeItem("token");
        localStorage.removeItem("User");
        localStorage.removeItem("BaseUrlUpload");
        this.$router.push("/");
      }
    },
    async gantipassword() {
      await this.$refs.form.validate();
      if (
        this.oldpassword.length != 0 &&
        this.newpassword.length != 0 &&
        this.confirmpassword.length != 0
      ) {
        this.submitgantipassword();
      } else {
        this.snackbar = true;
        this.colorsnackbar = "red";
        this.textsnackbar = "Data tidak boleh kosong";
      }
      // console.log(this.email);
      // console.log(this.password);
    },
  },
};
</script>