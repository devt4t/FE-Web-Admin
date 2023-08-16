<template>
  <v-main
    style="
      background-image: url('/images/BG_Login.jpg');
      background-repeat: no-repeat;
      background-attachment: fixed;
      background-size: 100% 100%;
      width: 100vw;
      height: 100vh;
      display: grid;
      align-items: center;
    "
  >
    <v-form ref="form" v-model="valid" lazy-validation class="">
      <v-card
        max-width="325"
        class="mx-auto px-5 pb-2 rounded-xl"
        elevation="7"
        data-aos="zoom-in"
      >
        <v-row align="center" justify="center">
          <v-img
            data-aos="zoom-in"
            data-aos-delay="200"
            max-width="250"
            src="/images/GEKO_short2.png"
            class="my-5 mb-10"
          ></v-img>
        </v-row>
        <!-- <v-card-title>LOGIN PAGE</v-card-title> -->
        <v-card-text class="pt-1 pb-0 px-3">
          <div data-aos="fade-right" data-aos-duration="500" data-aos-delay="400">

            <v-select
                dense
                color="success"
                item-color="success"
                :menu-props="{rounded: 'xl', offsetY: true, transition: 'slide-y-transition', dark: $store.state.theme == 'dark'}"
                hide-details
                rounded
                required
                v-model="tahunProgram"
                :items="$store.state.programYear.options"
                label="Tahun Program"
                :rules="[(v) => !!v || 'Field is required']"
                outlined
                class="mb-4"
            ></v-select>
          </div>

          <div data-aos="fade-right" data-aos-duration="500" data-aos-delay="400">
            <v-text-field
              label="Email"
              name="email"
              v-model="email"
              placeholder="Masukkan Email"
              prepend-inner-icon="mdi-email"
              filled
              required
              rounded
              dense
              v-on:keyup="submitLogin"
            ></v-text-field>
          </div>
          <div data-aos="fade-right"  data-aos-duration="500" data-aos-delay="500">
            <v-text-field
              label="Password"
              v-model="password"
              placeholder="Masukkan Password"
              :type="showPassword ? 'text' : 'password'"
              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append="showPassword = !showPassword"
              prepend-inner-icon="mdi-lock"
              filled
              required
              rounded
              dense
              v-on:keyup="submitLogin"
            ></v-text-field>
          </div>
        </v-card-text>

        <v-card-actions class="pt-0 pb-2 px-3 mb-4" data-aos="zoom-in" data-aos-delay="700">
          <v-btn
            block
            large
            width="200"
            @click="login()"
            color="green"
            class="mx-auto"
            :disabled="disablevalue"
            ><v-progress-circular
              v-if="load == true"
              :size="25"
              :width="5"
              indeterminate
              color="green"
            >
            </v-progress-circular>
            <h2 v-if="load == false">Login</h2>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
    <v-snackbar
      v-model="snackbar"
      :top="true"
      :color="colorsnackbar"
      :timeout="timeout"
    >
      {{ text }}
    </v-snackbar>
  </v-main>
</template>

<script>
import axios from "axios";

export default {
  name: "Trees",
  data: () => ({
    showPassword: false,
    tahunProgram:"",
    email: "",
    password: "",
    authtoken: "",
    load: false,
    disablevalue: false,
    BaseUrlGet: "https://t4tapi.kolaborasikproject.com/api/",
    //BaseUrlGet: "https://api.t4t-api.org/api/",
    BaseUrlUpload: "https://t4tadmin.kolaborasikproject.com/upload.php",
    BaseUrl: "https://t4tadmin.kolaborasikproject.com/",
    snackbar: false,
    text: "Test",
    timeout: 2000,
    colorsnackbar: null,
    valid: true,
  }),
  created() {
    this.firstAccessPage();
  },
  methods: {
    firstAccessPage() {
      var authtoken = localStorage.getItem("token");
      if (authtoken) {
        localStorage.removeItem("token");
      }
      var User = JSON.parse(localStorage.getItem("User"));
      if (User) {
        localStorage.removeItem("User");
      }
      var BaseUrlGet = localStorage.getItem("BaseUrlGet");
      if (BaseUrlGet) {
        localStorage.removeItem("BaseUrlGet");
      }
      var BaseUrl = localStorage.getItem("BaseUrl");
      if (BaseUrl) {
        localStorage.removeItem("BaseUrl");
      }
      var BaseUrlUpload = localStorage.getItem("BaseUrlUpload");
      if (BaseUrlUpload) {
        localStorage.removeItem("BaseUrlUpload");
      }
      this.load = false;
      this.disablevalue = false;
    },
    async cekLogin() {
      this.load = true;
      this.disablevalue = true;
      const datapost = {
        program_year: this.tahunProgram,
        email: this.email,
        password: this.password,
      };
      console.log(datapost);
      // console.log(this.BaseUrlGet);
      // this.dialogDetail = false;
      try {
        const response = await axios.post(
          this.BaseUrlGet + "LoginWeb",
          datapost
          
        );
        if(datapost.program_year){
            console.log(response.data.data.status.code);
          this.snackbar = true;
          if (response.data.data.status.code == 200) {
            this.load = false;
            this.disablevalue = false;
            this.colorsnackbar = "green";
            this.text = "Sukses Login";
            // console.log(response.data.data.result.access_token);
            localStorage.setItem("token", response.data.data.result.access_token);
            localStorage.setItem(
              "User",
              JSON.stringify(response.data.data.result.User)
            );
            localStorage.setItem("BaseUrlGet", this.BaseUrlGet);
            localStorage.setItem("BaseUrlUpload", this.BaseUrlUpload);
            localStorage.setItem("BaseUrl", this.BaseUrl);
            location.reload();
            this.$router.push("/Dashboard");
          } else {
            this.load = false;
            this.disablevalue = false;
            this.colorsnackbar = "red";
            this.text = "Gagal Login, username dan password salah";
          }
        }else{
          this.load = false;
        this.disablevalue = false;
        console.error(error.response);
        this.snackbar = true;
        this.colorsnackbar = "red";
        this.text = "Tahun Program Tidak Boleh Kosong";
        }

        
      } catch (error) {
        this.load = false;
        this.disablevalue = false;
        console.error(error.response);
        this.snackbar = true;
        this.colorsnackbar = "red";
        this.text = "Gagal Login, username dan password salah";
      }
    },

    login() {
      this.$refs.form.validate();
      // console.log(this.email);
      // console.log(this.password);
      this.cekLogin();
    },

    submitLogin: function (e) {
      if (e.keyCode === 13) {
        this.$refs.form.validate();
        this.cekLogin();
      }
      // this.log += e.key;
    },
  },
};
</script>

<style scoped>
.btn,
button,
input {
  border-radius: 35px;
}

.btn:hover,
button:hover {
  transition: 0.5s ease;
}
</style>