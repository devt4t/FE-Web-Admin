<template>
  <v-dialog v-model="isOpen" width="70%">
    <template v-slot:default="{ isActive }">
      <v-card>
        <v-card-title> Bulk Upload KML </v-card-title>
        <v-card-text>
          <v-btn variant="primary" @click="test">Testing</v-btn>
          <div class="upload d-flex flex-column" v-if="step == 1">
            <label for="kml">File KML</label>
            <input type="file" @change="handleFileChange($event)" />

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
            <div class="mt-4">
              <p v-for="(q, i) in questions" class="mb-0 text-09-em">
                {{ `Pertanyaan ${i + 1} : ${q.question}` }}
              </p>
              <table class="geko-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>No Lahan</th>
                    <th>Kelengkapan Data</th>
                    <th>Status</th>
                    <th v-for="(q, i) in questions" :key="`head-${i}`">
                      {{ `Pertanyaan ${i + 1}` }}
                    </th>
                  </tr>
                </thead>

                <tbody>
                  <tr v-for="(item, i) in data" :key="`key-${i}`">
                    <td>{{ i + 1 }}</td>
                    <td class="font-weight-bold">
                      <a
                        class="mb-0 text-link"
                        target="_blank"
                        :href="`/#/lahan-v2?view=detail&id=${item.id}`"
                        >{{ item.lahan_no }}</a
                      >
                    </td>
                    <td>
                      <div class="d-flex flex-row justify-content-center">
                        <span
                          class="badge"
                          :class="{
                            'bg-success': item.complete_data == 1,
                            'bg-info': item.complete_data == 0,
                          }"
                        >
                          {{
                            item.complete_data == 0
                              ? "Belum Diverifikasi FC"
                              : "Lengkap"
                          }}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div class="d-flex flex-row justify-content-center">
                        <span
                          class="badge"
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

                    <td v-for="(q, i) in questions" :key="`qt-${i}`">
                      <geko-input
                        v-if="item.complete_data == 1"
                        v-model="item[`question${i}`]"
                        :item="{
                          hide_label: true,
                          type: 'select-radio',
                          validation: ['required'],
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
      isOpen: false,
      loading: false,
      step: 1,
      data: [],
      questions: [],
      files: null,
    };
  },

  methods: {
    handleFileChange(e) {
      this.files = e.target.files[0];
    },

    async test() {
      const data = await fetch("http://localhost:9056/10_9000000500.kml")
        .then((r) => r.blob())
        .then((res) => {
          console.log("data", res);
        });

      console.log("data", data);
      //   this.$_api.upload("lahans/upload.php", {
      //     nama: moment().format("DDMMYYYYHHmmss"),
      //     dir: "polygon-ff",
      //     type: "polygon",
      //     fileToUpload: URL.createObjectURL(
      //       "https://localhost:9054/10_9000000500.kml"
      //     ),
      //   });
    },
    onUplaod() {
      if (!this.files || this.loading) return;
      this.loading = true;
      let data = new FormData();
      data.append("file", this.files);
      let config = {
        method: "post",
        url: "http://localhost:9056/lahan/kml",
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

          const lahanSample = this.data.find((x) => x.id);

          const gisQuestions = await this.$_api.get("getDetailLahan_new", {
            id: lahanSample.id,
          });

          if (Array.isArray(gisQuestions.lahan_term_question_list)) {
            this.questions = gisQuestions.lahan_term_question_list.filter(
              (x) => x.role_id == 14
            );
          }

          this.step = 2;
        })
        .catch((err) => {
          this.$_alert.error("Upload KML Gagal", err.response.data.messsage);
        });
    },
  },
  watch: {
    dataKey(t) {
      if (t > 1) {
        this.isOpen = true;
      }
    },
  },
};
</script>
