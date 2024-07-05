<template>
  <div class="lahan-gis-verification" v-if="ready">
    <h5 class="mb-3">Verifikasi Data</h5>

    <ValidationObserver ref="firstForm" v-slot="{ handleSubmit }">
      <form @submit.prevent="handleSubmit(onSubmit)" autocomplete="off">
        <v-row>
          <v-col lg="12">
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
          <v-col lg="12">
            <geko-input
              v-model="formData.land_area"
              :item="{
                label: 'Luas Lahan',
                type: 'number',
                validation: ['required'],
              }"
            />
          </v-col>
          <v-col lg="12">
            <geko-input
              v-model="formData.planting_area"
              :item="{
                label: 'Luas Area Tanam',
                type: 'number',
                validation: ['required'],
              }"
            />
          </v-col>
          <v-col lg="12">
            <geko-input
              v-model="formData.elevation"
              :item="{
                label: 'Elevasi (mdpl)',
                type: 'number',
                validation: ['required'],
              }"
            />
          </v-col>
          <v-col lg="12">
            <geko-input
              v-model="formData.kelerengan_tanah"
              :item="{
                label: 'Kelerengan Tanah',
                type: 'select',
                validation: ['required'],
                option: {
                  default_options: defaultData.slope,

                  default_label: formData.kelerengan_tanah_label,
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
            <geko-input
              v-model="formData.tutupan_lahan"
              :item="{
                label: 'Tutupan Lahan (%)',
                type: 'number',
                validation: ['required'],
              }"
            />
          </v-col>
          <v-col lg="12">
            <geko-input
              v-model="formData.tutupan_pohon_percentage"
              :item="{
                label: 'Tutupan Pohon (%)',
                type: 'number',
                validation: ['required'],
              }"
            />
          </v-col>

          <v-col md="12">
            <geko-input
              v-model="formData.tutupan_pohon_photo"
              :item="{
                label: 'Foto Tutupan Pohon',
                validation: ['required'],
                type: 'upload',
                api: 'lahans/upload.php',
                directory: 'lahans',
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
          <v-col lg="12">
            <geko-input
              v-model="formData.tutupan_rumput_percentage"
              :item="{
                label: 'Tutupan Rumput (%)',
                type: 'number',
                validation: ['required'],
              }"
            />
          </v-col>

          <v-col md="12">
            <geko-input
              v-model="formData.tutupan_rumput_photo"
              :item="{
                label: 'Foto Tutupan Rumput',
                validation: ['required'],
                type: 'upload',
                api: 'lahans/upload.php',
                directory: 'lahans',
                upload_type: 'image/*',
                setter: 'tutupan_rumput_photo',
                view_data: 'tutupan_rumput_photo',
                option: {
                  label_hint:
                    'Klik gambar untuk memilih berkas yang akan diunggah',
                  max_size: 5,
                },
              }"
            />
          </v-col>
          <v-col lg="12">
            <geko-input
              v-model="formData.tutupan_semak_percentage"
              :item="{
                label: 'Tutupan Semak (%)',
                type: 'number',
                validation: ['required'],
              }"
            />
          </v-col>

          <v-col md="12">
            <geko-input
              v-model="formData.tutupan_semak_photo"
              :item="{
                label: 'Foto Tutupan Semak',
                validation: ['required'],
                type: 'upload',
                api: 'lahans/upload.php',
                directory: 'lahans',
                upload_type: 'image/*',
                setter: 'tutupan_semak_photo',
                view_data: 'tutupan_semak_photo',
                option: {
                  label_hint:
                    'Klik gambar untuk memilih berkas yang akan diunggah',
                  max_size: 5,
                },
              }"
            />
          </v-col>
          <v-col lg="12">
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
          <v-col lg="12">
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
          <v-col lg="12">
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
          <v-col lg="12">
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
          <v-col lg="12">
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
          <v-col lg="12">
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
          <v-col lg="12" v-if="formData.nearby_village == 1">
            <geko-input
              v-model="formData.nearby_village_distance"
              :item="{
                label: 'Jarak ke Desa Terdekat',
                type: 'number',
                validation: ['required'],
              }"
            />
          </v-col>
          <v-col lg="12">
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
          <v-col lg="12">
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
          <v-col lg="12">
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
          <v-col lg="12">
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
  },
  mounted() {
    this.initData();
  },

  methods: {
    onSubmit() {
      console.log("data", this.formData);
      let payload = JSON.parse(JSON.stringify(this.formData));
      payload.current_id = this.$route.query.id;
      this.loading = true;
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
        ["nearby_village"],
        ["nearby_village_distance"],
        ["floods"],
        ["wildfire"],
        ["landslide"],
        ["drought"],
      ];

      for (const key of keys) {
        var _value = this.data[key[0]];
        if (_value == "-") _value = null;
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
