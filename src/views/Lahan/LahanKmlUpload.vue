<template>
  <v-dialog v-model="isOpen" width="90%" style="min-height: 90vh">
    <template v-slot:default="{ isActive }">
      <v-card>
        <v-card-title> Bulk Upload KML </v-card-title>
        <v-card-text>
          <div class="upload d-flex flex-column" v-if="step == 1">
            <label for="kml">File KML</label>
            <div class="upload-file-wrapper">
              <label for="kmlFile" class="kml-file">
                <div class="wrapper">
                  <v-icon>mdi-vector-polygon</v-icon>
                </div>
              </label>

              <p class="kml-label">
                <span v-if="!files" class="ml-2"
                  >Upload file KML yang berisi banyak lahan</span
                >
                <span class="ml-2" v-else>{{ files_name }}</span>
              </p>
              <input
                id="kmlFile"
                type="file"
                @change="handleFileChange($event)"
              />
            </div>

            <div class="d-flex flex-row justify-content-center">
              <v-btn @click="onUplaod" variant="success">
                <v-icon v-if="!loading">mdi-cloud-upload-outline</v-icon>

                <v-progress-circular
                  v-else
                  :size="20"
                  color="success"
                  indeterminate
                ></v-progress-circular>
                <span>Upload</span>
              </v-btn>
            </div>
          </div>

          <div class="d-flex flex-column result" v-if="step == 2">
            <ValidationObserver ref="mainForm" v-slot="{ handleSubmit }">
              <form
                @submit.prevent="handleSubmit(onBulkUpload)"
                autocomplete="off"
                v-if="ready"
              >
                <div class="mt-4">
                  <p v-for="(q, i) in questions" class="mb-0 text-09-em">
                    {{ `Pertanyaan ${i + 1} : ${q.question}` }}
                  </p>
                  <div
                    class="table-wrapper"
                    style="width: 100%; overflow-x: auto"
                  >
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
                          <th
                            v-for="(q, i) in questions"
                            :key="`head-${i}`"
                            style="min-width: 150px"
                          >
                            {{ `Pertanyaan ${i + 1}` }}
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        <tr v-for="(item, i) in data" :key="`key-${i}`">
                          <td>{{ i + 1 }}</td>
                          <!-- Lahan -->
                          <td class="font-weight-bold">
                            <a
                              class="mb-0 text-link"
                              target="_blank"
                              :href="`/#/lahan-v2?view=detail&id=${item.id}`"
                              >{{ item.lahan_no }}</a
                            >
                          </td>

                          <!-- KELENGKAPAN DATA -->
                          <td>
                            <div class="d-flex flex-row justify-content-center">
                              <span
                                class="badge text-08-em"
                                :class="{
                                  'bg-success': item.fc_complete_data == 1,
                                  'bg-info':
                                    item.fc_complete_data == 0 ||
                                    item.fc_complete_data == null,
                                }"
                              >
                                {{
                                  item.fc_complete_data
                                    ? "Lengkap"
                                    : "Belum Diverifikasi FC"
                                }}
                              </span>
                            </div>

                            <div
                              class="d-flex flex-row justify-content-center mt-2"
                            >
                              <span
                                class="badge text-08-em"
                                :class="{
                                  'bg-warning':
                                    item.approve == 0 &&
                                    item.updated_gis.toLowerCase() == 'belum',
                                  'bg-info':
                                    item.approve == 0 &&
                                    item.updated_gis.toLowerCase() == 'sudah',
                                  'bg-primary': item.approve == 1,
                                  'bg-success': item.approve == 2,
                                  'bg-danger': item.approve == 3,
                                }"
                              >
                                <span
                                  v-if="
                                    item.approve == 0 &&
                                    item.updated_gis.toLowerCase() == 'belum'
                                  "
                                  >Belum Diverifikasi</span
                                >
                                <span
                                  v-if="
                                    item.approve == 0 &&
                                    item.updated_gis.toLowerCase() == 'sudah'
                                  "
                                  >Diverifikasi GIS</span
                                >
                                <span v-else-if="item.approve == 1"
                                  >Diverifikasi FC</span
                                >
                                <span v-else-if="item.approve == 2"
                                  >Terverifikasi</span
                                >
                                <span v-else-if="item.approve == 3"
                                  >Force Majeure</span
                                >
                              </span>
                            </div>
                          </td>

                          <!-- ALTITUDE -->
                          <td>
                            <geko-input
                              :disabled="item.fc_complete_data != 1"
                              v-model="item.elevation"
                              :item="{
                                label: 'Altitude (mdpl)',
                                type: 'text',
                                validation:
                                  item.fc_complete_data != 1
                                    ? []
                                    : ['required'],
                                hide_label: true,
                              }"
                            />
                          </td>

                          <!-- POLYGON AREA -->
                          <td>
                            <geko-input
                              :disabled="item.fc_complete_data != 1"
                              v-model="item.gis_polygon_area"
                              :item="{
                                label: 'Luas Polygon ',
                                validation:
                                  item.fc_complete_data != 1
                                    ? []
                                    : ['required', 'double:2'],
                                type: 'text',
                                hide_label: true,
                              }"
                            />
                          </td>

                          <!-- JENIS TANAH -->
                          <td>
                            <geko-input
                              :disabled="item.fc_complete_data != 1"
                              v-model="item.soil_type"
                              :item="{
                                label: 'Luas Polygon ',
                                type: 'select',
                                validation:
                                  item.fc_complete_data != 1
                                    ? []
                                    : ['required'],
                                option: {
                                  default_options: [
                                    {
                                      label: 'Aluvial',
                                      code: 'Aluvial',
                                    },
                                    {
                                      label: 'Alvisol',
                                      code: 'Alvisol',
                                    },
                                    {
                                      label: 'Andosol',
                                      code: 'Andosol',
                                    },
                                    {
                                      label: 'Andosol Distrik',
                                      code: 'Andosol Distrik',
                                    },
                                    {
                                      label: 'Andosol Eutrik',
                                      code: 'Andosol Eutrik',
                                    },
                                    {
                                      label: 'Andosol Litik',
                                      code: 'Andosol Litik',
                                    },
                                    {
                                      label: 'Andosol Melanik',
                                      code: 'Andosol Melanik',
                                    },
                                    {
                                      label: 'Arenosol',
                                      code: 'Arenosol',
                                    },
                                    {
                                      label: 'Entisol',
                                      code: 'Entisol',
                                    },
                                    {
                                      label: 'Gleisol',
                                      code: 'Gleisol',
                                    },
                                    {
                                      label: 'Grumosol',
                                      code: 'Grumosol',
                                    },
                                    {
                                      label: 'Histosol',
                                      code: 'Histosol',
                                    },
                                    {
                                      label: 'Inseptisol',
                                      code: 'Inseptisol',
                                    },
                                    {
                                      label: 'Kambisol',
                                      code: 'Kambisol',
                                    },
                                    {
                                      label: 'Latosol',
                                      code: 'Latosol',
                                    },
                                    {
                                      label: 'Latosol Haplik',
                                      code: 'Latosol Haplik',
                                    },
                                    {
                                      label: 'Latosol Kromik',
                                      code: 'Latosol Kromik',
                                    },
                                    {
                                      label: 'Litosol',
                                      code: 'Litosol',
                                    },
                                    {
                                      label: 'Mediteran',
                                      code: 'Mediteran',
                                    },
                                    {
                                      label: 'Molisol',
                                      code: 'Molisol',
                                    },
                                    {
                                      label: 'Nitosol',
                                      code: 'Nitosol',
                                    },
                                    {
                                      label: 'Organosol',
                                      code: 'Organosol',
                                    },
                                    {
                                      label: 'Podsolik',
                                      code: 'Podsolik',
                                    },
                                    {
                                      label: 'Podsolik Haplik',
                                      code: 'Podsolik Haplik',
                                    },
                                  ],
                                  list_pointer: {
                                    label: 'label',
                                    code: 'code',
                                    display: ['label'],
                                  },
                                },
                                hide_label: true,
                              }"
                            />
                          </td>
                          <!-- QUESTIONS -->
                          <td v-for="(q, i) in questions" :key="`qt-${i}`">
                            <geko-input
                              :disabled="item.fc_complete_data != 1"
                              v-model="item[`question${i + 1}`]"
                              :item="{
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
                              }"
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div class="d-flex flex-row justify-content-center mt-3">
                    <v-btn variant="success" type="submit">
                      <v-icon v-if="!loading"> mdi-shape-polygon-plus </v-icon>

                      <v-progress-circular
                        v-else
                        :size="20"
                        color="success"
                        indeterminate
                      ></v-progress-circular>
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
import moment from "moment";
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
    };
  },

  methods: {
    async onBulkUpload() {
      if (this.loading) return;
      this.loading = true;

      let verifSuccess = [];
      let verifFailed = [];
      for (const lahan of this.data) {
        console.log("lahan", lahan);

        if (!lahan.id) continue;
        const isValid = lahan.fc_complete_data == 1;
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

      let alertMessage = `<p>Data lahan berhasil diverifikasi : ${
        verifSuccess.length === 0
          ? "<strong>Tidak Ada</strong>"
          : `<strong>${verifSuccess.join(
              ", "
            )}</strong><br /></p>Data lahan gagal diverifikasi : ${
              verifFailed.length === 0
                ? "<strong>Tidak Ada</strong>"
                : `<strong>${verifFailed.join(", ")}</strong>`
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
          `${moment().format("DDMMYYYYHHmmss")}.kml`
        );

        const kmlPath = await this.$_api
          .upload("lahans/upload.php", {
            nama: moment().format("DDMMYYYYHHmmss"),
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
      let config = {
        method: "post",
        url: `${this.$_config.baseUrlExport}lahan/kml`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        data: data,
      };

      axios
        .request(config)
        .then(async (res) => {
          this.data = res.data.data;
          this.loading = false;
          this.questions = res.data.questions;
          // const lahanSample = this.data.find((x) => x.id);

          // const gisQuestions = await this.$_api.get("getDetailLahan_new", {
          //   id: lahanSample.id,
          // });

          // if (Array.isArray(gisQuestions.lahan_term_question_list)) {
          //   this.questions = gisQuestions.lahan_term_question_list.filter(
          //     (x) => x.role_id == 14
          //   );
          // }

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
};
</script>
