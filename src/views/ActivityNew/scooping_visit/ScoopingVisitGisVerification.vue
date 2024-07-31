<template>
  <v-dialog v-model="isOpen" width="70%">
    <template v-slot:default="{ isActive }">
      <v-card>
        <v-card-title> Verifikasi GIS </v-card-title>
        <v-card-text>
          <ValidationObserver ref="firstForm" v-slot="{ handleSubmit }">
            <form @submit.prevent="handleSubmit(onSubmit)" autocomplete="off">
              <v-row
                class="scooping-visit-gis-verification"
                v-if="scoopingVisitCode"
              >
                <v-col md="12" class="form-separator">
                  <h4>Data Lahan</h4>
                </v-col>

                <v-col md="6">
                  <geko-input
                    v-model="formData.dry_land_area"
                    :item="{
                      label: 'Luas Lahan Kering',
                      validation: ['required'],
                      type: 'text',
                    }"
                  />
                </v-col>
                <v-col md="6">
                  <geko-input
                    v-model="formData.land_type"
                    :item="{
                      label: 'Jenis Tanah',
                      validation: ['required'],
                      type: 'select',
                      option: {
                        multiple: true,
                        default_options: defaultData.land_type,
                        list_pointer: {
                          code: 'value',
                          label: 'text',
                          display: ['text'],
                        },
                      },
                    }"
                  />
                </v-col>
                <v-col md="6">
                  <geko-input
                    v-model="formData.slope"
                    :item="{
                      label: 'Kelerengan Tanah',
                      validation: ['required'],
                      type: 'select',
                      option: {
                        multiple: true,
                        default_options: defaultData.slope,
                        list_pointer: {
                          code: 'value',
                          label: 'text',
                          display: ['text'],
                        },
                      },
                    }"
                  />
                </v-col>
                <v-col md="6">
                  <geko-input
                    v-model="formData.altitude"
                    :item="{
                      label: 'Ketinggian Tanah',
                      validation: ['required'],
                      type: 'select',
                      option: {
                        multiple: true,
                        default_options: defaultData.altitude,
                        list_pointer: {
                          code: 'value',
                          label: 'text',
                          display: ['text'],
                        },
                      },
                    }"
                  />
                </v-col>
                <v-col md="6">
                  <geko-input
                    v-model="formData.rainfall"
                    :item="{
                      label: 'Curah Hujan',
                      validation: ['required'],
                      type: 'select',
                      option: {
                        multiple: true,
                        default_options: defaultData.rainfall,
                        list_pointer: {
                          code: 'value',
                          label: 'text',
                          display: ['text'],
                        },
                      },
                    }"
                  />
                </v-col>
                <v-col md="12" class="form-separator">
                  <h4>Upload Polygon File (GIS)</h4>
                </v-col>
                <v-col md="12">
                  <geko-input
                    v-model="formData.village_polygon"
                    :item="{
                      label: 'Polygon Desa',
                      validation: ['required'],
                      type: 'upload',
                      setter: 'village_polygon',
                      view_data: 'village_polygon',
                      api: 'scooping_visits/upload.php',

                      upload_type: '.kml',
                      directory: 'village_polygon',
                      option: {
                        icon: 'mdi-vector-polygon',
                        label_hint:
                          'Klik polygon untuk memilih file .kml yang akan diunggah',
                      },
                    }"
                  />
                </v-col>
                <v-col md="12">
                  <geko-input
                    v-model="formData.dry_land_polygon"
                    :item="{
                      label: 'Polygon Lahan Kering / Kritis',
                      validation: [],
                      type: 'upload',
                      setter: 'dry_land_polygon',
                      upload_type: '.kml',
                      view_data: 'dry_land_polygon',
                      api: 'scooping_visits/upload.php',
                      directory: 'village_polygon',
                      option: {
                        icon: 'mdi-vector-polygon',
                        label_hint:
                          'Klik polygon untuk memilih file .kml yang akan diunggah',
                      },
                    }"
                  />
                </v-col>

                <v-col md="12" class="d-flex flex-row justify-content-end">
                  <v-btn variant="light" @click="isOpen = false" class="mr-2">
                    Batal
                  </v-btn>
                  <v-btn type="submit" :disabled="loading" variant="success">
                    Verifikasi GIS
                  </v-btn>
                </v-col>
              </v-row>
            </form>
          </ValidationObserver>
        </v-card-text>
        <!-- </template> -->
      </v-card>
    </template>
  </v-dialog>
</template>

<script>
import defaultData from "./ScoopingVisitData.js";
export default {
  name: "scooping-visit-gis-verification",
  props: {
    dataKey: {
      required: true,
      type: Number,
    },
    dryLandArea: {
      required: true,
      type: Number,
      default: 0,
    },
    scoopingVisitCode: {
      required: false,
      type: String,
    },
  },
  data() {
    return {
      isOpen: false,
      loading: false,
      formData: {
        land_type: null,
      },
    };
  },

  methods: {
    onSubmit() {
      if (this.loading) return;
      this.loading = true;
      let extPayload = {
        current_id: this.$route.query.id,
        verificator_email: this.$store.state.User.email,
      };

      let payload = Object.assign(extPayload, this.formData);
      payload.land_type = payload.land_type.join(",");
      payload.rainfall = payload.rainfall.join(",");
      payload.slope = payload.slope.join(",");
      payload.altitude = payload.altitude.join(",");
      this.$_api
        .post("UpdateVerifScoopingVisitGIS_new", payload)
        .then(async () => {
          this.loading = false;
          this.isOpen = false;
          await this.$_api.get("MailToSocialOfficer", {
            data_no: this.scoopingVisitCode,
          });
          this.$_alert.success("Data GIS berhasil diperbarui");
          this.$emit("success", true);
        })
        .catch((err) => {
          this.loading = false;
          this.$_alert.error(err);
        });
    },
  },
  computed: {
    defaultData() {
      return defaultData;
    },
  },
  watch: {
    dataKey(t) {
      if (t > 1) {
        this.isOpen = true;
        this.$set(this.formData, "dry_land_area", this.dryLandArea);
      }
    },
    dryLandArea(t) {
      this.$set(this.formData, "dry_land_area", t);
    },
  },
};
</script>
