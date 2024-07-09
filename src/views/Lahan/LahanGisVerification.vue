<template>
  <div class="lahan-gis-verification" v-if="ready">
    <div class="d-flex flex-row mb-3" style="justify-content: space-between">
      <h5>Verifikasi Data</h5>
      <button @click="$emit('close', true)"><v-icon>mdi-close</v-icon></button>
    </div>

    <ValidationObserver ref="firstForm" v-slot="{ handleSubmit }">
      <form @submit.prevent="handleSubmit(onSubmit)" autocomplete="off">
        <v-row>
          <v-col lg="12" v-if="role == 'gis'">
            <geko-input
              v-model="formData.polygon_from_gis"
              :item="{
                label: 'Polygon Lahan',
                validation: ['required'],
                type: 'upload',
                setter: 'polygon_from_gis',
                view_data: 'polygon_from_gis',
                api: 'lahans/upload.php',
                upload_type: '.kml',
                directory: 'polygon-ff',
                option: {
                  icon: 'mdi-vector-polygon',
                  label_hint:
                    'Klik polygon untuk memilih file .kml yang akan diunggah',
                },
              }"
            />
          </v-col>
          <v-col lg="12" v-if="role == 'gis'">
            <geko-input
              v-model="formData.land_area"
              :item="{
                label: 'Luas Lahan (m)',
                type: 'number',
                validation: ['required'],
              }"
            />
          </v-col>
          <v-col lg="12" v-if="role == 'gis'">
            <geko-input
              v-model="formData.elevation"
              :item="{
                label: 'Elevasi (mdpl)',
                type: 'number',
                validation: ['required'],
              }"
            />
          </v-col>
          <v-col lg="12" v-if="role == 'gis'">
            <geko-input
              v-model="formData.kelerengan_lahan"
              :item="{
                label: 'Kelerengan Lahan',
                type: 'select',
                validation: ['required'],
                option: {
                  default_options: defaultData.slope,

                  default_label: formData.kelerengan_lahan_label,
                  list_pointer: {
                    label: 'name',
                    code: 'code',
                    display: ['name'],
                  },
                },
              }"
            />
          </v-col>

          <v-col lg="12" v-if="role == 'gis'">
            <v-row class="tutupan-wrapper pb-5">
              <v-col lg="12">
                <h4 class="mb-2 text-success">Tutupan</h4>
                <h4 class="font-weight-normal">
                  Tutupan Lahan :
                  <span class="text-success font-weight-bold"
                    >{{ formData.tutupan_lahan || 0 }}%</span
                  >
                </h4>
                <h4 class="font-weight-normal">
                  Area Tanam :
                  <span class="text-success font-weight-bold"
                    >{{ formData.planting_area || 0 }}%
                    <span
                      v-if="formData.planting_area"
                      class="font-weight-normal"
                      >(~{{
                        (formData.planting_area / 100) * formData.land_area
                      }}m)</span
                    ></span
                  >
                </h4>
              </v-col>
              <v-col lg="12">
                <geko-input
                  v-model="formData.tutupan_pohon_percentage"
                  :item="{
                    label: 'Tutupan Pohon (%)',
                    type: 'number',
                    validation: ['required', 'max_value:100'],
                  }"
                />
              </v-col>
              <v-col lg="12">
                <geko-input
                  v-model="formData.tutupan_tanaman_bawah_percentage"
                  :item="{
                    label: 'Tutupan Tanaman Bawah (%)',
                    tooltip:
                      'Tutupan tanaman bawah seperti pisang, singkong, ubi jalar, cabai, jagung, sereh, pepaya, rumput gajah/rumput pakan ternak, bawang daun, terong, kol, tomat, jahe, kacang tanah, kentang, kapulaga dan sejenisnya',
                    tooltip_width: '20em',
                    type: 'number',
                    validation: ['required', 'max_value:100'],
                  }"
                />
              </v-col>
              <v-col lg="12" class="pb-5">
                <geko-input
                  v-model="formData.tutupan_lain_bangunan_percentage"
                  :item="{
                    label: 'Tutupan Bangunan / Lainnya (%)',
                    tooltip:
                      'Tutupan bangunan atau lainnya seperti rumah, kolam atau sejenisnya',
                    tooltip_width: '20em',
                    type: 'number',
                    validation: ['required', 'max_value:100'],
                  }"
                />
              </v-col>
            </v-row>
          </v-col>

          <v-col md="12" v-if="role == 'gis'">
            <geko-input
              v-model="formData.tutupan_pohon_photo"
              :item="{
                label: 'Foto Tutupan Pohon',
                validation:
                  formData.tutupan_pohon_percentage &&
                  formData.tutupan_pohon_percentage > 0
                    ? ['required']
                    : [],
                type: 'upload',
                api: 'lahans/upload.php',
                directory: 'foto-lahan',
                upload_type: 'image/*',
                setter: 'tutupan_pohon_photo',
                view_data: 'tutupan_pohon_photo',
                option: {
                  label_hint:
                    'Klik gambar untuk memilih berkas yang akan diunggah',
                  max_size: 5,
                },
              }"
            />
          </v-col>

          <v-col md="12" v-if="role == 'gis'">
            <geko-input
              v-model="formData.tutupan_tanaman_bawah_photo"
              :item="{
                label: 'Foto Tutupan Tanaman Bawah',
                validation:
                  formData.tutupan_tanaman_bawah_percentage &&
                  formData.tutupan_tanaman_bawah_percentage > 0
                    ? ['required']
                    : [],
                type: 'upload',
                api: 'lahans/upload.php',
                directory: 'foto-lahan',
                upload_type: 'image/*',
                setter: 'tutupan_tanaman_bawah_photo',
                view_data: 'tutupan_tanaman_bawah_photo',
                option: {
                  label_hint:
                    'Klik gambar untuk memilih berkas yang akan diunggah',
                  max_size: 5,
                },
              }"
            />
          </v-col>

          <v-col md="12" v-if="role == 'gis'">
            <geko-input
              v-model="formData.tutupan_lain_bangunan_photo"
              :item="{
                label: 'Foto Tutupan Bangunan / Lainnya',
                validation:
                  formData.tutupan_lain_bangunan_percentage &&
                  formData.tutupan_lain_bangunan_percentage > 0
                    ? ['required']
                    : [],
                type: 'upload',
                api: 'lahans/upload.php',
                directory: 'foto-lahan',
                upload_type: 'image/*',
                setter: 'tutupan_lain_bangunan_photo',
                view_data: 'tutupan_lain_bangunan_photo',
                option: {
                  label_hint:
                    'Klik gambar untuk memilih berkas yang akan diunggah',
                  max_size: 5,
                },
              }"
            />
          </v-col>
          <v-col lg="12" v-if="role == 'gis'">
            <geko-input
              v-model="formData.access_to_lahan"
              :item="{
                label: 'Akses ke Lahan',
                type: 'select',
                validation: ['required'],
                option: {
                  default_options: defaultData.access_to_lahan,

                  default_label: formData.access_to_lahan_label,
                  list_pointer: {
                    label: 'name',
                    code: 'code',
                    display: ['name'],
                  },
                },
              }"
            />
          </v-col>
          <v-col lg="12" v-if="role == 'gis'">
            <geko-input
              v-model="formData.jarak_lahan"
              :item="{
                label: 'Jarak Ke Lahan',
                type: 'select',
                validation: ['required'],
                option: {
                  default_options: defaultData.lahan_distance,

                  default_label: formData.jarak_lahan_label,
                  list_pointer: {
                    label: 'name',
                    code: 'code',
                    display: ['name'],
                  },
                },
              }"
            />
          </v-col>
          <v-col lg="12" v-if="role == 'gis'">
            <geko-input
              v-model="formData.water_availability_level"
              :item="{
                label: 'Ketersediaan Air',
                type: 'select',
                validation: ['required'],
                option: {
                  default_options: defaultData.water_availability_level,

                  default_label: formData.water_availability_level_label,
                  list_pointer: {
                    label: 'name',
                    code: 'code',
                    display: ['name'],
                  },
                },
              }"
            />
          </v-col>
          <v-col lg="12" v-if="role == 'gis'">
            <geko-input
              v-model="formData.water_availability"
              :item="{
                label: 'Akses Air',
                type: 'select',
                validation: ['required'],
                option: {
                  default_options: defaultData.water_availability,

                  default_label: formData.water_availability_label,
                  list_pointer: {
                    label: 'name',
                    code: 'code',
                    display: ['name'],
                  },
                },
              }"
            />
          </v-col>
          <v-col lg="12" v-if="role == 'gis'">
            <geko-input
              v-model="formData.access_to_water_sources"
              :item="{
                label: 'Jarak Akses Air',
                type: 'select',
                validation: ['required'],
                option: {
                  default_options: defaultData.access_to_water_sources,

                  default_label: formData.access_to_water_sources_label,
                  list_pointer: {
                    label: 'name',
                    code: 'code',
                    display: ['name'],
                  },
                },
              }"
            />
          </v-col>
          <v-col lg="12" v-if="role == 'gis'">
            <geko-input
              v-model="formData.nearby_village"
              :item="{
                label: 'Desa Terdekat',
                type: 'select-radio',
                validation: ['required'],
                option: {
                  default_options: defaultData.yes_no_option,

                  default_label: formData.nearby_village_label,
                  list_pointer: {
                    label: 'name',
                    code: 'code',
                    display: ['name'],
                  },
                },
              }"
            />
          </v-col>
          <v-col lg="12" v-if="formData.nearby_village == 1 && role == 'gis'">
            <geko-input
              v-model="formData.nearby_village_distance"
              :item="{
                label: 'Jarak ke Desa Terdekat',
                type: 'number',
                validation: ['required'],
              }"
            />
          </v-col>

          <v-col lg="12" v-if="role == 'gis'">
            <geko-input
              v-model="formData.animal_protected_habitat"
              :item="{
                label: 'Habitat Satwa/Kawasan Dilindungi Terdekat',
                type: 'select-radio',
                validation: ['required'],
                option: {
                  default_options: defaultData.yes_no_option,

                  default_label: formData.animal_protected_habitat,
                  list_pointer: {
                    label: 'name',
                    code: 'code',
                    display: ['name'],
                  },
                },
              }"
            />
          </v-col>
          <v-col
            lg="12"
            v-if="formData.animal_protected_habitat == 1 && role == 'gis'"
          >
            <geko-input
              v-model="formData.animal_protected_habitat_distance"
              :item="{
                label: 'Jarak ke Satwa/Kawasan Dilindungi Terdekat (m)',
                type: 'number',
                validation: ['required'],
              }"
            />
          </v-col>
          <v-col lg="12" v-if="role == 'gis'">
            <geko-input
              v-model="formData.floods"
              :item="{
                label: 'Kejadian Banjir',
                type: 'select-radio',
                validation: ['required'],
                option: {
                  default_options: defaultData.yes_no_option,
                  list_pointer: {
                    label: 'name',
                    code: 'code',
                    display: ['name'],
                  },
                },
              }"
            />
          </v-col>
          <v-col lg="12" v-if="role == 'gis'">
            <geko-input
              v-model="formData.wildfire"
              :item="{
                label: 'Kejadian Kebakaran',
                type: 'select-radio',
                validation: ['required'],
                option: {
                  default_options: defaultData.yes_no_option,
                  list_pointer: {
                    label: 'name',
                    code: 'code',
                    display: ['name'],
                  },
                },
              }"
            />
          </v-col>
          <v-col lg="12" v-if="role == 'gis'">
            <geko-input
              v-model="formData.landslide"
              :item="{
                label: 'Kejadian Longsor',
                type: 'select-radio',
                validation: ['required'],
                option: {
                  default_options: defaultData.yes_no_option,
                  list_pointer: {
                    label: 'name',
                    code: 'code',
                    display: ['name'],
                  },
                },
              }"
            />
          </v-col>
          <v-col lg="12" v-if="role == 'gis'">
            <geko-input
              v-model="formData.drought"
              :item="{
                label: 'Kejadian Kekeringan',
                type: 'select-radio',
                validation: ['required'],
                option: {
                  default_options: defaultData.yes_no_option,
                  list_pointer: {
                    label: 'name',
                    code: 'code',
                    display: ['name'],
                  },
                },
              }"
            />
          </v-col>
          <v-col lg="12" v-for="(question, i) in questions" :key="`quest-${i}`">
            <geko-input
              v-model="formData[`question_${question.id}`]"
              :item="{
                label: question.question + '?',
                type: 'select-radio',
                validation: ['required'],
                option: {
                  default_options: defaultData.question_option,
                  list_pointer: {
                    label: 'name',
                    code: 'code',
                    display: ['name'],
                  },
                },
              }"
            />
          </v-col>

          <v-col lg="12" v-if="role == 'um'">
            <geko-input
              v-model="formData.eligible_status"
              :item="{
                label: 'Eligibilitas Lahan',
                type: 'select-radio',
                validation: ['required'],
                option: {
                  default_options: [
                    {
                      label: 'Tidak Bisa Ikut',
                      code: '0',
                    },
                    {
                      label: 'Bisa Ikut Dengan Kondisi',
                      code: '1',
                    },
                    {
                      label: 'Bisa Ikut',
                      code: '2',
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
          </v-col>

          <v-col lg="12" v-if="role == 'fc'">
            <geko-input
              v-model="formData.moduls"
              :item="{
                label: 'Status Lahan',
                type: 'select-radio',
                validation: ['required'],
                option: {
                  default_options: [
                    {
                      label: 'Terverifikasi',
                      code: 'verification',
                    },
                    {
                      label: 'Tidak Terverifikasi',
                      code: 'unverification',
                    },
                    {
                      label: 'Force Majeur',
                      code: '3',
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
          </v-col>

          <v-col lg="12" v-if="role == 'fc-verif-data'">
            <geko-input
              v-model="formData.fc_complete_data"
              :item="{
                label: 'Kelengkapan Data',
                type: 'select-radio',
                validation: ['required'],
                option: {
                  default_options: [
                    {
                      label: 'Lengkap',
                      code: '1',
                    },
                    {
                      label: 'Tidak Lengkap',
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
          </v-col>
          <v-col lg="12">
            <v-btn
              type="submit"
              variant="warning"
              class="w-100"
              style="width: 100%"
              :disabled="loading"
            >
              <v-icon>mdi-pencil-outline</v-icon>
              <span>Verifikasi Data</span>
            </v-btn>
          </v-col>
        </v-row>
      </form>
    </ValidationObserver>
  </div>
</template>

<script>
import defaultData from "./LahanData.js";
export default {
  name: "lahan-gis-verification",
  props: {
    data: {
      required: true,
      type: Object,
      default: () => {},
    },
    questions: {
      required: false,
      default: () => [],
    },
    answers: {
      required: false,
      default: () => [],
    },
    role: {
      required: false,
      default: null,
    },
  },
  mounted() {
    this.initData();
  },

  methods: {
    calculateTutupan(t, f, key) {
      let _pohon = parseInt(this.formData.tutupan_pohon_percentage) || 0;
      let _tanaman_bawah =
        parseInt(this.formData.tutupan_tanaman_bawah_percentage) || 0;
      let _lainnya =
        parseInt(this.formData.tutupan_lain_bangunan_percentage) || 0;

      const tutupanLahan = _pohon + _tanaman_bawah + _lainnya;
      const plantingArea = 100 - (_pohon + _tanaman_bawah + _lainnya);

      if (tutupanLahan > 100) {
        this.$_alert.error({}, "Tutupan lahan maksimal 100%");
        this.$set(this.formData, key, f);
        return;
      }
      this.$set(this.formData, "tutupan_lahan", tutupanLahan);
      this.$set(this.formData, "planting_area", plantingArea);
    },
    async onSubmit() {
      let payload = JSON.parse(JSON.stringify(this.formData));
      payload.current_id = this.$route.query.id;

      this.loading = true;
      console.log(this.questions);
      for (const question of this.questions) {
        console.log("question", question);
        console.log("answer", this.answers);
        const isCreate = "updateLahantermAnswer_new";
        continue;
        await this.$_api.post(
          isCreate ? "addLahanTermAnswer_new" : "updateLahantermAnswer_new",
          {
            lahan_no: this.data.lahan_no,
            term_id: question.id,
            term_answer: this.formData[`question_${question.id}`],
            program_year: this.$_config.programYear.model || "2024",
          }
        );
      }
      return;
      if (this.role === "gis") {
        const nullableData = [
          "tutupan_lahan",
          "tutupan_pohon_percentage",
          "tutupan_tanaman_bawah_percentage",
          "tutupan_lain_bangunan_percentage",
          "tutupan_lain_bangunan_photo",
          "tutupan_pohon_photo",
          "tutupan_tanaman_bawah_photo",
          "nearby_village",
          "animal_protected_habitat",
        ];

        for (const item of nullableData) {
          if (payload[item] == null) {
            payload[item] = "0";
          }
        }
        this.$_api
          .post("UpdateLahanByGIS_new", payload)
          .then(() => {
            this.loading = false;
            this.$_alert.success("Data lahan berhasil diverifikasi");
            this.$emit("success", true);
          })
          .catch(() => {
            this.loading = false;
          });
      } else if (this.role == "fc") {
        this.$_api
          .post("UpdateLahanApproval_new", {
            moduls: this.formData.moduls,
            current_id: this.$route.query.id,
          })
          .then(() => {
            this.loading = false;
            this.$_alert.success("Data lahan berhasil diverifikasi");
            this.$emit("success", true);
          })
          .catch(() => {
            this.loading = false;
          });
      } else if (this.role == "fc-verif-data") {
        this.$_api
          .post("UpdateLahanFCCompleteStatus_new", {
            current_id: this.$route.query.id,
            fc_complete_data: parseInt(this.formData.fc_complete_data),
          })
          .then(() => {
            this.loading = false;
            this.$_alert.success("Data lahan berhasil diverifikasi");
            this.$emit("success", true);
          })
          .catch(() => {
            this.loading = false;
          });
      } else if (this.role == "um") {
        this.$_api
          .post("UpdateLahanEligibleStatus_new", {
            current_id: this.$route.query.id,
            eligible_status: parseInt(this.formData.eligible_status),
          })
          .then(() => {
            this.loading = false;
            this.$_alert.success("Data lahan berhasil diverifikasi");
            this.$emit("success", true);
          })
          .catch(() => {
            this.loading = false;
          });
      }
    },
    initData() {
      const keys = [
        ["land_area"],
        ["planting_area"],
        ["elevation"],
        ["kelerengan_lahan", "array", "slope"],
        ["access_to_lahan", "array", "access_to_lahan"],
        ["jarak_lahan", "array", "lahan_distance"],
        ["water_availability_level", "array", "water_availability_level"],
        ["access_to_water_sources", "array", "access_to_water_sources"],
        ["access_to_water_sources", "array", "access_to_water_sources"],
        ["nearby_village", "boolean"],
        ["nearby_village_distance"],
        ["floods", "boolean"],
        ["wildfire", "boolean"],
        ["landslide", "boolean"],
        ["drought", "boolean"],
        ["tutupan_lahan"],
        ["tutupan_pohon_percentage"],
        ["tutupan_tanaman_bawah_percentage"],
        ["polygon_from_gis"],
        ["tutupan_lain_bangunan_percentage"],
        ["tutupan_pohon_photo"],
        ["tutupan_tanaman_bawah_photo"],
        ["tutupan_lain_bangunan_photo"],
        ["water_availability"],
        ["animal_protected_habitat", "boolean"],
        ["fc_complete_data", "boolean"],
      ];
      for (const question of this.questions) {
        keys.push([`question_${question.id}`, "question", question.id]);
      }

      for (const key of keys) {
        var _value = this.data[key[0]];
        if (_value == "-") _value = null;

        if (key.length > 1 && key[1] == "boolean") {
          _value = typeof _value === "number" ? _value.toString() : _value;
        }

        if (key.length > 2 && key[1] == "question") {
          let _answer = this.answers.find((x) => x.term_id == key[2]);
          if (_answer) {
            _value = [0, 1].includes(_answer.term_answer)
              ? _answer.term_answer.toString()
              : null;
          }
        }
        this.$set(this.formData, key[0], _value);
        if (key.length > 1 && key[1] == "array") {
          var _valueLabel = defaultData[key[2]].find((x) => x.code == _value);

          this.$set(this.formData, `${key[0]}_label`, _valueLabel);
        }
      }

      this.ready = true;
    },
  },

  watch: {
    "formData.polygon_from_gis": {
      handler(v) {
        if (v) {
          // polygonUploaded(v)
          this.$emit("polygon_change", v);
        }
      },
    },
    "formData.tutupan_pohon_percentage": {
      handler(t, f) {
        this.calculateTutupan(t, f, "tutupan_pohon_percentage");
      },
    },
    "formData.tutupan_tanaman_bawah_percentage": {
      handler(t, f) {
        this.calculateTutupan(t, f, "tutupan_tanaman_bawah_percentage");
      },
    },
    "formData.tutupan_lain_bangunan_percentage": {
      handler(t, f) {
        this.calculateTutupan(t, f, "tutupan_lain_bangunan_percentage");
      },
    },
  },
  computed: {
    defaultData() {
      return defaultData;
    },
  },
  data() {
    return {
      loading: false,
      formData: {},
      ready: false,
    };
  },
};
</script>
