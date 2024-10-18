<template>
  <v-dialog v-model="isOpen" :width="step == 1 ? '50%' : '90%'" :style="{
    'min-height': '90vh',
  }">
    <template v-slot:default="{ isActive }">
      <v-card>
        <v-card-title class="text-center d-block font-weight-bold">
          Bulk Upload KML {{ kmlType == "land" ? "Lahan" : "Tutupan" }}
        </v-card-title>
        <v-card-text>
          <div class="upload d-flex flex-column" v-if="step == 1">
            <geko-input v-model="kmlType" :item="{
              type: 'select-radio',
              label: 'Jenis Polygon',
              validation: ['required'],
              option: {
                list_pointer: {
                  label: 'label',
                  code: 'code',
                  display: ['label'],
                },
                default_options: [
                  {
                    label: 'Polygon Lahan',
                    code: 'land',
                  },
                  {
                    label: 'Polygon Tutupan',
                    code: 'cover',
                  },
                ],
              },
            }" />
            <label for="kml">File KML</label>
            <div class="upload-file-wrapper">
              <label for="kmlFile" class="kml-file">
                <div class="wrapper">
                  <v-icon>mdi-vector-polygon</v-icon>
                </div>
              </label>

              <p class="kml-label">
                <span v-if="!files" class="ml-2">Upload file KML yang berisi banyak lahan</span>
                <span class="ml-2" v-else>{{ files_name }}</span>
              </p>
              <input id="kmlFile" type="file" @change="handleFileChange($event)" />
            </div>

            <div class="mb-4" v-if="step == 1 && loading">
              <v-progress-linear v-model="uploadProgress" color="success" height="25">
                <template v-slot:default="{ value }">
                  <strong>{{ Math.ceil(value) }}%</strong>
                </template>
              </v-progress-linear>
            </div>

            <div class="d-flex flex-row justify-content-center">

              <v-btn @click="onUplaod" variant="success">
                <v-icon v-if="!loading">mdi-cloud-upload-outline</v-icon>

                <v-progress-circular v-else :size="20" color="success" indeterminate></v-progress-circular>
                <span>Upload</span>
              </v-btn>
            </div>
          </div>

          <div class="d-flex flex-column result" v-if="step == 2 && kmlType == 'land'">
            <ValidationObserver ref="mainForm" v-slot="{ handleSubmit }">
              <form @submit.prevent="handleSubmit(onBulkUpload)" autocomplete="off" v-if="ready">
                <div class="mt-4">
                  <p v-for="(q, i) in questions" class="mb-0 text-09-em">
                    {{ `Pertanyaan ${i + 1} : ${q.question}` }}
                  </p>
                  <div class="table-wrapper" style="width: 100%; overflow-x: auto">
                    <table class="geko-table">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>No Lahan</th>
                          <th style="min-width: 200px">
                            Kelengkapan Data &amp; Status
                          </th>
                          <th>Altitude</th>
                          <th>Luas Polygon</th>
                          <th style="min-width: 200px">Jenis Tanah</th>
                          <th v-for="(q, i) in questions" :key="`head-${i}`" style="min-width: 150px">
                            {{ `Pertanyaan ${i + 1}` }}
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        <tr v-for="(item, i) in data" :key="`key-${i}`">
                          <td>{{ i + 1 }}</td>
                          <!-- Lahan -->
                          <td class="font-weight-bold">
                            <a class="mb-0 text-link" target="_blank" :href="`/#/lahan-v2?view=detail&id=${item.id}`">{{
                              item.lahan_no }}</a>
                          </td>

                          <!-- KELENGKAPAN DATA -->
                          <td>
                            <div class="d-flex flex-row justify-content-center">
                              <span class="badge text-08-em" :class="{
                                'bg-success': item.fc_complete_data == 1,
                                'bg-info':
                                  item.fc_complete_data == 0 ||
                                  item.fc_complete_data == null,
                              }">
                                {{
                                  item.fc_complete_data
                                    ? "Lengkap"
                                    : "Belum Diverifikasi FC"
                                }}
                              </span>
                            </div>

                            <div class="d-flex flex-row justify-content-center mt-2">
                              <span class="badge text-08-em" :class="{
                                'bg-warning':
                                  item.approve == 0 &&
                                  item.updated_gis.toLowerCase() == 'belum',
                                'bg-info':
                                  item.approve == 0 &&
                                  item.updated_gis.toLowerCase() == 'sudah',
                                'bg-primary': item.approve == 1,
                                'bg-success': item.approve == 2,
                                'bg-danger': item.approve == 3,
                              }">
                                <span v-if="
                                  item.approve == 0 &&
                                  item.updated_gis.toLowerCase() == 'belum'
                                ">Belum Diverifikasi</span>
                                <span v-if="
                                  item.approve == 0 &&
                                  item.updated_gis.toLowerCase() == 'sudah'
                                ">Diverifikasi GIS</span>
                                <span v-else-if="item.approve == 1">Diverifikasi FC</span>
                                <span v-else-if="item.approve == 2">Terverifikasi</span>
                                <span v-else-if="item.approve == 3">Force Majeure</span>
                              </span>
                            </div>
                          </td>

                          <!-- ALTITUDE -->
                          <td>
                            <geko-input :disabled="item.fc_complete_data != 1" v-model="item.elevation" :item="{
                              label: 'Altitude (mdpl)',
                              type: 'text',
                              validation:
                                item.fc_complete_data != 1
                                  ? []
                                  : ['required'],
                              hide_label: true,
                            }" />
                          </td>

                          <!-- POLYGON AREA -->
                          <td>
                            <geko-input :disabled="item.fc_complete_data != 1" v-model="item.gis_polygon_area" :item="{
                              label: 'Luas Polygon ',
                              validation:
                                item.fc_complete_data != 1
                                  ? []
                                  : ['required', 'double:2'],
                              type: 'text',
                              hide_label: true,
                            }" />
                          </td>

                          <!-- JENIS TANAH -->
                          <td>
                            <geko-input :disabled="item.fc_complete_data != 1" v-model="item.soil_type" :item="{
                              label: 'Luas Polygon ',
                              type: 'select',
                              validation:
                                item.fc_complete_data != 1
                                  ? []
                                  : ['required'],
                              option: {
                                default_options: lahanData.soil_type,
                                list_pointer: {
                                  label: 'label',
                                  code: 'code',
                                  display: ['label'],
                                },
                              },
                              hide_label: true,
                            }" />
                          </td>
                          <!-- QUESTIONS -->
                          <td v-for="(q, i) in questions" :key="`qt-${i}`">
                            <geko-input :disabled="item.fc_complete_data != 1" v-model="item[`question${i + 1}`]" :item="{
                              hide_label: true,
                              type: 'select-radio',
                              validation:
                                item.fc_complete_data != 1
                                  ? []
                                  : ['required'],
                              option: {
                                default_options: [
                                  {
                                    label: 'Ya',
                                    code: '1',
                                  },
                                  {
                                    label: 'Tidak',
                                    code: '0',
                                  },
                                ],
                                list_pointer: {
                                  label: 'name',
                                  code: 'code',
                                  display: ['name'],
                                },
                              },
                            }" />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div class="d-flex flex-row justify-content-center mt-3">
                    <v-btn variant="success" type="submit">
                      <v-icon v-if="!loading"> mdi-shape-polygon-plus </v-icon>

                      <v-progress-circular v-else :size="20" color="success" indeterminate></v-progress-circular>
                      <span class="ml-1">Verifikasi Data</span>
                    </v-btn>
                  </div>
                </div>
              </form>
            </ValidationObserver>
          </div>
          <div class="d-flex flex-column result" v-if="step == 2 && kmlType == 'cover'">
            <ValidationObserver ref="coverForm" v-slot="{ handleSubmit }">
              <form @submit.prevent="handleSubmit(onBulkUpload)" autocomplete="off" v-if="ready">
                <div class="mt-4">
                  <p v-for="(q, i) in questions" class="mb-0 text-09-em">
                    {{ `Pertanyaan ${i + 1} : ${q.question}` }}
                  </p>
                  <div class="table-wrapper" style="width: 100%; overflow-x: auto">
                    <table class="geko-table">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>No Lahan</th>
                          <th style="min-width: 200px">
                            Kelengkapan Data &amp; Status
                          </th>
                          <th>Eligibilitas</th>
                          <th style="max-width: 100px">Luas Lahan (m2)</th>
                          <th>Luas Tutupan (m2)</th>
                          <th>Luas Area Tanam (m2)</th>
                          <th v-for="(q, i) in questions" :key="`head-${i}`" style="min-width: 150px">
                            {{ `Pertanyaan ${i + 1}` }}
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        <tr v-for="(item, i) in data" :key="`key-${i}`" :class="{
                          eligible: item.gis_eligible_status == 1,
                          'not-eligible': item.gis_eligible_status == 0,
                        }">
                          <td>{{ i + 1 }}</td>
                          <!-- Lahan -->
                          <td class="font-weight-bold">
                            <a class="mb-0 text-link" target="_blank" :href="`/#/lahan-v2?view=detail&id=${item.id}`">{{
                              item.lahan_no }}</a>
                          </td>

                          <!-- KELENGKAPAN DATA -->
                          <td>
                            <div class="d-flex flex-row justify-content-center">
                              <span class="badge text-08-em" :class="{
                                'bg-success': item.fc_complete_data == 1,
                                'bg-info':
                                  item.fc_complete_data == 0 ||
                                  item.fc_complete_data == null,
                              }">
                                {{
                                  item.fc_complete_data
                                    ? "Lengkap"
                                    : "Belum Diverifikasi FC"
                                }}
                              </span>
                            </div>

                            <div class="d-flex flex-row justify-content-center mt-2">
                              <span class="badge text-08-em" :class="{
                                'bg-warning':
                                  item.approve == 0 &&
                                  item.updated_gis.toLowerCase() == 'belum',
                                'bg-info':
                                  item.approve == 0 &&
                                  item.updated_gis.toLowerCase() == 'sudah',
                                'bg-primary': item.approve == 1,
                                'bg-success': item.approve == 2,
                                'bg-danger': item.approve == 3,
                              }">
                                <span v-if="
                                  item.approve == 0 &&
                                  item.updated_gis.toLowerCase() == 'belum'
                                ">Belum Diverifikasi</span>
                                <span v-if="
                                  item.approve == 0 &&
                                  item.updated_gis.toLowerCase() == 'sudah'
                                ">Diverifikasi GIS</span>
                                <span v-else-if="item.approve == 1">Diverifikasi FC</span>
                                <span v-else-if="item.approve == 2">Terverifikasi</span>
                                <span v-else-if="item.approve == 3">Force Majeure</span>
                              </span>
                            </div>
                          </td>

                          <td>
                            <span class="badge" :class="{
                              'bg-success': item.gis_eligible_status == 1,
                              'bg-danger': item.gis_eligible_status == 0,
                            }">
                              {{
                                item.gis_eligible_status == 1
                                  ? "Eligible"
                                  : "Not Eligible"
                              }}
                            </span>
                          </td>

                          <!-- POLYGON AREA -->
                          <td>
                            <geko-input :disabled="true" v-model="item.gis_polygon_area" :item="{
                              label: 'Luas Area Tanam',
                              validation: [],
                              type: 'text',
                              hide_label: true,
                            }" />
                          </td>
                          <!-- TUTUPAN AREA -->
                          <td>
                            <geko-input :disabled="item.fc_complete_data != 1" v-model="item.polygon_tutupan_area"
                              :item="{
                                label: 'Luas Tutupan',
                                validation:
                                  item.fc_complete_data != 1
                                    ? []
                                    : ['required', 'double'],
                                type: 'text',
                                hide_label: true,
                              }" />
                          </td>

                          <!-- PLANTING AREA -->
                          <td>
                            <geko-input :disabled="item.gis_planting_area" v-model="item.gis_planting_area" :item="{
                              label: 'Luas Area Tanam',
                              validation: item.gis_planting_area
                                ? []
                                : ['required', 'double'],
                              type: 'text',
                              hide_label: true,
                            }" />
                          </td>
                          <!-- QUESTIONS -->
                          <td v-for="(q, i) in questions" :key="`qt-${i}`">
                            <geko-input :disabled="item.fc_complete_data != 1" v-model="item[`answer${q.id}`]" :item="{
                              hide_label: true,
                              type: 'select-radio',
                              validation:
                                item.fc_complete_data != 1
                                  ? []
                                  : ['required'],
                              option: {
                                default_options: [
                                  {
                                    label: 'Ya',
                                    code: '1',
                                  },
                                  {
                                    label: 'Tidak',
                                    code: '0',
                                  },
                                ],
                                list_pointer: {
                                  label: 'name',
                                  code: 'code',
                                  display: ['name'],
                                },
                              },
                            }" />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div class="card-footer d-flex flex-row justify-content-center mt-3">
                    <v-btn variant="success" type="submit">
                      <v-icon v-if="!loading"> mdi-shape-polygon-plus </v-icon>

                      <v-progress-circular v-else :size="20" color="success" indeterminate></v-progress-circular>
                      <span class="ml-1">Verifikasi Data</span>
                    </v-btn>
                  </div>
                </div>
              </form>
            </ValidationObserver>
          </div>
        </v-card-text>
      </v-card>
    </template>
  </v-dialog>
</template>

<script>
import axios from "axios";
import lahanData from "./LahanData.js";
export default {
  name: "lahan-kml-upload",
  props: {
    dataKey: {
      required: true,
      type: Number,
    },
  },
  data() {
    return {
      ready: false,
      isOpen: false,
      loading: false,
      step: 1,
      data: [],
      questions: [],
      files: null,
      files_name: null,
      kmlType: "land",
      uploadProgress: '0'
    };
  },

  methods: {
    async onBulkUpload() {
      if (this.loading) return;
      this.loading = true;
      if (this.kmlType === "land") {
        this.onUplaodLandPolygon();
      } else if (this.kmlType === "cover") {
        this.onUploadCoverPolygon();
      }
    },

    async submitTermAnswer(item, question, answer) {
      return new Promise(async (resolve, reject) => {
        let payload = {
          lahan_no: item.lahan_no,
          program_year: this.$_config.programYear.model,
          term_id: question.id,
          term_answer: parseInt(answer),
        };

        await this.$_api
          .post("addLahanTermAnswer_new", payload)
          .then(() => {
            return resolve(true);
          })
          .catch(() => resolve(false));
      });
    },

    async onUploadCoverPolygon() {
      let verifSuccess = [];
      let verifFailed = [];
      let verifSkip = [];
      for (const lahan of this.data) {
        if (
          !lahan.id ||
          lahan.fc_complete_data != 1 ||
          lahan.gis_polygon_area <= 0
        ) {
          verifSkip.push(lahan.lahan_no);
          continue;
        }

        const tutupanLahan = parseFloat(lahan.polygon_tutupan_area / lahan.gis_polygon_area * 100).toFixed(2)
        const payload = {
          lahan_no: lahan.lahan_no,
          polygon_tutupan_area: lahan.polygon_tutupan_area,
          polygon_tutupan_photo: null,
          gis_planting_area: lahan.gis_planting_area,
          gis_eligibility_status: lahan.gis_eligible_status,
          tutupan_lahan: tutupanLahan
        };

        const kmlPath = await this.uploadKmlFile(
          `${lahan.lahan_no}-LAND_COVER`
        ).catch((err) => {
          return false;
        });
        if (!kmlPath) {
          verifFailed.push(lahan.lahan_no);
          continue;
        }

        for (const question of this.questions) {
          await this.submitTermAnswer(
            lahan,
            question,
            lahan[`answer${question.id}`]
          );
        }
        payload.polygon_tutupan_photo = kmlPath;

        await this.$_api
          .post("update-lahan/polygon-tutupan", payload)
          .then(() => {
            verifSuccess.push(lahan.lahan_no);
            return true;
          })
          .catch((err) => {
            verifFailed.push(lahan.lahan_no);
            return false;
          });
      }

      var htmlMessage = `
        <p>Data lahan berhasil diverifikasi :
          ${verifSuccess.join(", ")} (${verifSuccess.length}) <br /><br/>
          Data lahan gagal diverifikasi :
          ${verifFailed.join(", ")} (${verifFailed.length}) <br /><br/>
          Data lahan tidak diverifikasi :
          ${verifSkip.join(", ")} (${verifSkip.length}) <br /><br/>
        </p>
      `;

      this.$_alert.success(
        "Berhasil",
        htmlMessage,
        "center",
        true,
        false,
        true
      );
      this.loading = false;
    },
    async onUplaodLandPolygon() {
      let verifSuccess = [];
      let verifFailed = [];
      for (const lahan of this.data) {
        if (!lahan.id) continue;
        const isValid =
          lahan.fc_complete_data == 1 &&
          ["belum", "Belum", null, "", "-"].includes(lahan.updated_gis);
        // const isValid = lahan.fc_complete_data == 1;
        if (!isValid) continue;
        let tutupanPercentage =
          parseFloat(lahan.tutupan_lain_bangunan_percentage || 0) +
          parseFloat(lahan.tutupan_pohon_percentage || 0) +
          parseFloat(lahan.tutupan_tanaman_bawah_percentage || 0);
        let tutupanPlantingArea = parseFloat(
          (tutupanPercentage / 100) * lahan.gis_polygon_area
        ).toFixed(2);
        let plantingArea = parseFloat(
          lahan.gis_polygon_area - tutupanPlantingArea
        );
        let payload = {
          current_id: lahan.id,
          elevation: lahan.elevation,
          gis_polygon_area: lahan.gis_polygon_area,
          soil_type: lahan.soil_type,
          gis_planting_area: parseFloat(plantingArea).toFixed(2),
        };

        const kmlPath = await this.uploadKmlFile(lahan.lahan_no).catch(
          (err) => {
            console.log("err", err);

            return false;
          }
        );
        if (!kmlPath) {
          verifFailed.push(lahan.lahan_no);
          continue;
        }
        payload.polygon_from_gis = kmlPath;
        console.log("payload update lahan", payload);

        const updatePolygon = await this.$_api
          .post("UpdateLahanByGIS_new", payload)
          .catch((err) => {
            console.log("err update polygon", err);

            return false;
          });

        if (!updatePolygon) {
          verifFailed.push(lahan.lahan_no);
          continue;
        }
        verifSuccess.push(lahan.lahan_no);

        for (let i = 0; i < this.questions.length; i++) {
          const dataItem = this.questions[i];
          const payloadTermAnswer = {
            lahan_no: lahan.lahan_no,
            term_id: dataItem.id,
            term_answer: lahan[`question${i + 1}`],
            program_year: this.$_config.programYear.model,
          };
          await this.$_api.post("addLahanTermAnswer_new", payloadTermAnswer);

          console.log("payload term answer", payloadTermAnswer);
        }
      }

      this.loading = false;
      this.ready = true;
      this.data = [];
      this.step = 1;
      this.questions = [];
      this.isOpen = false;

      let alertTitle = "Verifikasi Lahan Berhasil";
      if (verifSuccess.length == 0) alertTitle = "Verifikasi Lahan Gagal";

      let alertMessage = `<p>Data lahan berhasil diverifikasi : ${verifSuccess.length === 0
        ? "<strong>Tidak Ada</strong>"
        : `<strong>${verifSuccess.length}</strong><br />${verifSuccess.join(
          ", "
        )}</strong><br /></p>Data lahan gagal diverifikasi : ${verifFailed.length === 0
          ? "<strong>Tidak Ada</strong>"
          : `<strong>${verifFailed.length}<br />${verifFailed.join(
            ", "
          )}</strong>`
        }</p>`
        }</p>`;
      this.$_alert.success(
        alertTitle,
        alertMessage,
        "center",
        true,
        false,
        true
      );
    },
    async uploadKmlFile(lahanNo) {
      return new Promise(async (resolve, reject) => {
        const kmlBlob = await axios
          .get(`${this.$_config.baseUrlExport}kml/${lahanNo}.kml`)
          .catch((err) => {
            this.$_alert.error(
              null,
              "Upload KML Gagal",
              err.response.data.messsage
            );
            return false;
          });

        if (!kmlBlob) return reject();

        const kmlFile = new File(
          [kmlBlob.data],
          `lahan_polygon_${lahanNo}.kml`
        );

        const kmlPath = await this.$_api
          .upload("lahans/upload.php", {
            nama: `lahan_polygon_${lahanNo}`,
            dir: "polygon-gis",
            type: "polygon",
            fileToUpload: kmlFile,
          })
          .catch(() => false);

        if (!kmlPath) return reject();

        return resolve(`lahans/${kmlPath}`);
      });
    },
    handleFileChange(e) {
      this.files = e.target.files[0];
      this.files_name = e.target.files[0].name;
    },
    onUplaod() {
      if (!this.files || this.loading) return;
      this.loading = true;
      let data = new FormData();
      data.append("file", this.files);
      data.append("kml_type", this.kmlType);
      let config = {
        method: "post",
        url: `${this.$_config.baseUrlExport}lahan/kml`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        data: data,
        onUploadProgress: (progressEvent) => {
          this.uploadProgress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
        },
      };

      axios
        .request(config)
        .then(async (res) => {
          this.data = res.data.data;
          this.loading = false;
          this.questions = res.data.questions;
          this.ready = true;
          this.step = 2;
        })
        .catch((err) => {
          this.$_alert.error("Upload KML Gagal", err.response.data.messsage);
          this.ready = true;
          this.loading = false;
          this.step = 1;
        });
    },
  },
  watch: {
    dataKey(t) {
      if (t > 1) {
        this.isOpen = true;
      }
    },

    isOpen(t) {
      if (!t) {
        this.loading = false;
        this.data = [];
        this.step = 1;
        this.questions = [];
      }
    },
    files(t) {
      if (!t) {
        this.files_name = "";
      }
    },
  },

  computed: {
    lahanData() {
      return lahanData;
    },
  },
};
</script>

<style scoped>
table {
  border-collapse: collapse;
}

.card-footer {
  padding-top: 1em;
  border-top: 1px solid rgba(128, 128, 128, 0.2);
}

table tr.not-eligible {
  background-color: #f8ebd750 !important;
}

table tr.eligible {
  background-color: #d7f8dd50 !important;
}
</style>
