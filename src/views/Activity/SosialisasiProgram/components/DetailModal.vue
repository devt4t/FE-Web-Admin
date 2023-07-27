<template>
  <v-dialog
    v-model="showModal"
    content-class="rounded-xl mx-1"
    max-width="1200"
    scrollable
    persistent
  >
    <v-card>
      <v-card-title class="rounded-xl green darken-3 ma-1 pa-2">
        <span class="white--text"
          ><v-btn class="white dark--text mr-1" fab x-small
            ><v-icon color="grey darken-3">mdi-file-document</v-icon></v-btn
          >
          Sosialisasi Program Form {{ this.form_no }}</span
        >
        <v-icon color="white" class="ml-auto" @click="showModal = false"
          >mdi-close-circle</v-icon
        >
      </v-card-title>
      <v-card-text class="pa-0" style="min-height: 300px;">
        <!-- Loading -->
        <v-overlay absolute :value="loading.show">
          <div class="d-flex flex-column justify-center align-center">
            <LottieAnimation
              ref="anim"
              :animationData="lottie.data.loading"
              :loop="true"
              style="height: 64px;"
            />
            <p class="mt-2 mb-0">
              {{ loading.text }}
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
        <div v-if="datas">
          <!-- Global data -->
          <v-row class="ma-0 mx-2 mx-lg-4">
            <v-col cols="12" md="12" lg="7">
              <v-card
                class="rounded-lg"
                data-aos="fade-down"
                :key="`location_card-${showModal}`"
              >
                <v-card-title class="grey darken-3 white--text pa-1 px-3">
                  <span style="font-size: 13px">
                    <v-icon color="white">mdi-map-marker</v-icon>
                    Lokasi Desa
                  </span>
                </v-card-title>
                <v-card-text class="pa-3">
                  <v-row>
                    <v-col cols="12" md="6" lg="3">
                      <v-card class="pa-2 elevation-0">
                        <span
                          class="grey--text text--darken-2"
                          style="font-size: 13px"
                        >
                          Management Unit
                        </span>
                        <h4>
                          {{ datas.namaMU ? datas.namaMU || "-" : "-" }}
                        </h4>
                      </v-card>
                    </v-col>
                    <v-col cols="12" md="6" lg="3">
                      <v-card class="pa-2 elevation-0">
                        <span
                          class="grey--text text--darken-2"
                          style="font-size: 13px"
                        >
                          Target Area
                        </span>
                        <h4>
                          {{ datas.namaTA ? datas.namaTA || "-" : "-" }}
                        </h4>
                      </v-card>
                    </v-col>
                    <v-col cols="12" md="6" lg="3">
                      <v-card class="pa-2 elevation-0">
                        <span
                          class="grey--text text--darken-2"
                          style="font-size: 13px"
                        >
                          Desa
                        </span>
                        <h4>
                          {{
                            datas.namaDesa ? datas.namaDesa || "-" : "-"
                          }}
                        </h4>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12" md="12" lg="5">
              <v-card
                class="rounded-lg"
                data-aos="fade-down"
                :key="`date_period_card-${showModal}`"
              >
                <v-card-title class="grey darken-3 white--text pa-1 px-3">
                  <span style="font-size: 13px">
                    <v-icon color="white">mdi-calendar</v-icon>
                    Tanggal Sosialisasi Program
                  </span>
                </v-card-title>
                <v-card-text class="pa-3">
                  <v-row>
                    <v-col cols="12">
                      <v-card class="pa-2 elevation-0">
                        <span
                          class="grey--text text--darken-2"
                          style="font-size: 13px"
                        >
                          {{
                            datas.form_date ? datas.form_date || "-" : "-"
                          }}
                        </span>
                        <h4></h4>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
          <!-- Stepper -->
          <v-stepper
            :vertical="localConfig.windowWidth < localConfig.breakLayoutFrom"
            v-model="stepper.model"
            class="rounded-xl mt-2 elevation-0"
          >
            <!-- Stepper Content -->
            <v-stepper-items>
              <div v-for="(stepperName, stepperIndex) in stepper.steps">
                <v-stepper-step
                  v-if="
                    localConfig.windowWidth < localConfig.breakLayoutFrom &&
                      stepper.steps.length >= 1
                  "
                  color="green"
                  :complete="stepper.model > 1"
                  :step="1"
                  editable
                  class="rounded-xl py-3 ma-1"
                >
                  <span
                    ><v-icon
                      :color="stepper.model > stepperIndex + 1 ? 'green' : ''"
                      class="mr-1"
                      >mdi-{{ stepper.steps_icon[stepperIndex] }}</v-icon
                    >{{ stepper.steps[stepperIndex] }}</span
                  >
                </v-stepper-step>
                <v-stepper-content
                  v-if="stepper.steps.length >= stepperIndex + 1"
                  class="pt-0"
                  :step="stepperIndex + 1"
                >
                  <v-card class="ma-1 rounded-xl" min-height="250px">
                    <v-card-text>
                      <div
                        v-for="(data, dataIndex) in groupingData[stepperName]"
                      >
                        <div class="d-flex align-center my-8" v-if="data.label">
                          <p
                            class="mb-0 grey--text text--darken-3"
                            style="font-size: 17px"
                          >
                            <v-icon class="mr-2">{{ data.labelIcon }}</v-icon
                            >{{ data.label }}
                          </p>
                          <v-divider class="mx-2" color=""></v-divider>
                        </div>
                        <!-- table -->
                        <div v-if="data.dataType === 'table'">
                          <v-data-table
                            :dense="data.table.dense"
                            :caption="data.table.caption"
                            multi-sort
                            :hide-default-footer="data.table.hideDefaultFooter"
                            :headers="data.table.headers"
                            :items="dataListFarmer"
                            :items-per-page="data.table.itemsPerPage"
                            :class="
                              `rounded-xl elevation-6 mx-2 mx-lg-3 pa-1 elevation-3 overflow-hidden mt-4`
                            "
                            :show-expand="data.table.expand"
                          >
                            <!-- Table Index -->
                            <template v-slot:item.index="{ index }">
                              {{ index + 1 }}
                            </template>
                            <template v-slot:item.previewPhoto="{ item }">
                              <v-img
                                @click="showLightbox(item.previewPhoto)"
                                :src="item.previewPhoto"
                                :lazy-src="item.previewPhoto"
                                :alt="item.previewPhoto"
                                width="100"
                                height="100"
                                contain
                                class="rounded-lg"
                              ></v-img>
                            </template>
                          </v-data-table>
                        </div>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-stepper-content>
              </div>
            </v-stepper-items>
          </v-stepper>
        </div>
      </v-card-text>
      <v-card-actions
        class="justify-center"
        v-if="showVerification"
      >
        <v-btn
          v-if="datas.is_verified == 0"
          rounded
          color="green"
          outlined
          class="pr-4"
          @click="() => confirmVerification('verify')"
          ><v-icon class="mr-1">mdi-check-circle</v-icon> Verifikasi</v-btn
        >
        <v-btn
          v-if="datas.is_verified == 1"
          rounded
          color="red"
          outlined
          class="pr-4"
          @click="() => confirmVerification('unverif')"
          ><v-icon class="mr-1">mdi-close-circle</v-icon> Unverifikasi</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from "axios";
import moment from "moment";
import LottieAnimation from "lottie-web-vue";
import Swal from "sweetalert2";

import formOptions from "@/assets/json/rraPraOptions.json";
import treeAnimation from "@/assets/lottie/tree.json";

export default {
  components: {
    LottieAnimation,
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    id: {
      type: String,
      default: "0",
    },
    form_no: {
      type: String,
      default: null,
    },
  },
  data: () => ({
    datas: {},
    dataListFarmer: [],
    groupingData: {
      "List Petani": [
        {
          label: "Daftar Petani",
          labelIcon: "mdi-flower",
          dataType: "table",
          dataSource: "",
          dataKey: "",
          table: {
            dense: true,
            search: true,
            searchValue: "",
            hideDefaultFooter: false,
            itemsPerPage: 20,
            headers: [
              { text: "No", value: "index", width: 70, sortable: false },
              { text: "Nama Petani", value: "name" },
              { text: "Photo Minat ", value: "previewPhoto" },
              { text: "Nama Training ", value: "namaTraining" },
              { text: "Pola ", value: "pattern" },
              { text: "Kayu Dan MPTS", value: "tree_mpts_name" },
              { text: "Status", value: "status_program" },
            ],
          },
        },
      ],
    },
    verified_data: 0,
    loading: {
      show: false,
      text: "Loading...",
    },
    localConfig: {
      windowWidth: window.innerWidth,
      breakLayoutFrom: 1140,
      maxSubDataTotal: 5,
      requiredInputIcon: "mdi-star",
    },
    lottie: {
      data: {
        loading: treeAnimation,
      },
    },
    stepper: {
      model: 1,
      steps: ["List Petani"],
      steps_icon: ["account-group"],
    },
  }),
  computed: {
    showModal: {
      get: function() {
        if (this.show) {
          if (this.form_no) {
            this.getData(this.form_no);
          }
        }
        return this.show;
      },
      set: function(newVal) {
        if (!newVal) this.$emit("action", { type: "close", name: "detail" });
      },
    },
    showVerification() {
      const user = this.$store.state.User;
      const role_group = user.role_group;
      const role_name = user.role_name;
      if (role_group == "IT" || role_name == "UNIT MANAGER") {
        if (this.dataListFarmer.length > 0) return true;
      }
      return false;
    },
  },
  watch: {
    "stepper.model": {
      handler(val) {
        // console.log(val)
      },
    },
  },
  methods: {
    confirmVerification(type) {
      const url =
        type == "verify" ? "VerificationFormMinat" : "UnVerificationFormMinat";
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#2e7d32",
        cancelButtonColor: "#d33",
        cancelButtonText: "Tidak Jadi",
        confirmButtonText: "Ya, Lanjutkan!",
      }).then((result) => {
        if (result.isConfirmed) {
          this.loading.show = true;
          this.loading.text = `${
            type == "verify" ? "Verifying" : "Unverifying"
          } data...`;
          axios
            .post(
              this.$store.getters.getApiUrl(url),
              {
                form_no: this.form_no,
                verified_by: this.$store.state.User.email,
              },
              this.$store.state.apiConfig
            )
            .then((res) => {
              Swal.fire({
                title: "Verified!",
                text: `Scooping data #${this.id} has been verified.`,
                icon: "success",
                confirmButtonColor: "#2e7d32",
              });
              this.getData(this.form_no);
              this.$emit("swal", {
                type: "success",
                message: `Data ${
                  type == "verify" ? "Verified" : "Unverified"
                }!`,
              });
            })
            .catch((err) => {
              this.errorResponse(err);
              Swal.fire({
                title: "Failed!",
                text: `Failed to proceed.`,
                icon: "error",
                confirmButtonColor: "#f44336",
              });
            })
            .finally(() => {
              this.loading.show = false;
              this.loading.text = "Loading...";
            });
        }
      });
    },
    async errorResponse(error) {
      console.log(error);
      if (error.response) {
        if (error.response.status) {
          if (error.response.status == 401) {
            const confirm = await Swal.fire({
              title: "Session Ended!",
              text: "Please login again.",
              icon: "warning",
              confirmButtonColor: "#2e7d32",
              confirmButtonText: "Okay",
            });
            if (confirm) {
              localStorage.removeItem("token");
              this.$router.push("/");
            }
          }
          if (error.response.status === 500 || error.response.status === 400) {
            let errMessage = error.response.data.message;
            if (errMessage)
              if (errMessage.includes("Duplicate entry"))
                errMessage = "Data sudah ada!";
            Swal.fire({
              title: "Error!",
              text: `${errMessage || error.message}`,
              icon: "error",
              confirmButtonColor: "#f44336",
            });
          }
        }
      }
    },
    async getData(form_no) {
      try {
        this.loading.show = true;
        let params = {
          form_no: form_no,
        };
        const res = await axios.get(
          this.$store.getters.getApiUrl(`GetFormMinatDetail`),
          {
            params: params,
            ...this.$store.state.apiConfig,
          }
        );
        if (res) {
          const data = res.data.data.result;
          this.datas = data
          if (data.form_date && data.form_date != "0000-00-00") this.datas.form_date = moment(data.form_date).format("DD MMMM YYYY");
          else this.datas.form_date = '-'
          this.dataListFarmer = data.ListFarmer;
          this.dataListFarmer.map((item) => {
            item.previewPhoto = this.$store.state.apiUrlImage + item.photo;
            item.tree_mpts_name = ``;
            if (item.tree1) {
              item.tree_mpts_name += item.tree1.tree_name
            }
            if (item.tree2) {
              item.tree_mpts_name += ', ' + item.tree2.tree_name
            }
            if (item.tree3) {
              item.tree_mpts_name += ', ' + item.tree3.tree_name
            }
          });
        }
      } catch (err) {
        this.errorResponse(err);
      } finally {
        this.loading.show = false;
      }
    },
    getIntervalDay(start, end) {
      const startDate = moment(start);
      const endDate = moment(end);

      const duration = moment.duration(endDate.diff(startDate));
      const days = duration.asDays();
      return days;
    },
    indonesianify(eng) {
      if (eng === "north") return "Utara";
      if (eng === "east") return "Timur";
      if (eng === "south") return "Selatan";
      if (eng === "west") return "Barat";

      return "??";
    },
    onResize() {
      this.localConfig.windowWidth = window.innerWidth;
      // console.log(this.localConfig.windowWidth)
    },
    showLightbox(imgs, index) {
      if (imgs) this.$store.state.lightbox.imgs = imgs;

      if (index) this.$store.state.lightbox.index = index;
      else this.$store.state.lightbox.index = 0;

      this.$store.state.lightbox.show = true;
    },
    whatsappPhone(no) {
      return no.replace(/^0/, "62");
    },
  },
  mounted() {
    this.$nextTick(() => {
      window.addEventListener("resize", this.onResize);
    });
  },
};
</script>
