<template>
  <v-dialog v-model="isOpen" width="70%">
    <template v-slot:default="{ isActive }">
      <v-card>
        <v-card-title>Assign Data Penugasan Monitoring {{ 1 }}Tahunan </v-card-title>

        <v-card-text class="ff-email-wrapper">
          <ValidationObserver ref="firstForm" v-slot="{ handleSubmit }">
            <form @submit.prevent="handleSubmit(onSubmit)" autocomplete="off">
              <v-row class="assign-ff-wrapper" v-if="data">
                <v-col lg="12">
                  <v-row class="mx-3 bg-grey">
                    <v-col lg="6">
                      <geko-input v-model="sampling" :item="{
                        label: 'Metode Sampling',
                        type: 'select',
                        validation: ['required'],
                        option: {
                          default_label: 'Sampling',
                          default_options: [
                            {
                              label: 'Tetap',
                              code: 'Tetap',
                            },
                            {
                              label: 'Random',
                              code: 'Random',
                            }
                          ],
                          list_pointer: {
                            label: 'label',
                            code: 'code',
                            display: ['label'],
                          },
                        },
                      }" />
                    </v-col>

                    <v-col lg="5">
                      <geko-input v-model="assigned_to" :item="{
                        type: 'select',
                        label: 'Field Facilitator',
                        validation: ['required'],
                        api: 'GetFFNow',
                        option: {
                          getterKey: 'data.result',
                          list_pointer: {
                            code: 'ff_no',
                            label: 'name',
                            display: ['name', 'ff_no'],
                          },
                        },
                      }" />
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>

              <v-row>
                <v-col lg="12" class="d-flex flex-row justify-content-center">
                  <v-btn variant="warning" class="d-flex flex-row align-items-center" type="submit">
                    <v-icon>mdi-pencil-outline</v-icon>
                    <span>Assign!</span>
                  </v-btn>
                </v-col>
              </v-row>
              <v-row> </v-row>
            </form>
          </ValidationObserver>
        </v-card-text>
      </v-card>
    </template>
  </v-dialog>
</template>

<script>
import { random } from 'lodash';

export default {
  name: "populate2-assign-sampling-ff",
  props: {
    data: {
      required: true,
      default: () => { },
    },
    dataKey: {
      required: true,
      default: 0,
      type: Number,
    },
    refreshKey: {
      required: true,
      default: 0,
      type: Number,
    },
  },

  methods: {
    async onSubmit() {
      // console.log("submit", this.data);
      if (this.loading) return;
      this.loading = true;
      var payload = {
        populate_no: this.data.populate_no,
        sampling: this.sampling,
        assign_to: this.assigned_to
      }
      console.log(payload)
      const prompt = await this.$_alert.confirm('Assign Data Populasi Monitoring?', 'Pastikan Data yang Akan di Assign Sudah Benar!', 'Ya, Assign!', 'Batal', true)
      if (prompt.isConfirmed) {
        this.$_api.post('populate-monitoring/3-to-4/assign', payload)
          .then(() => {
            this.$_alert.success('Berhasil Melakukan Assignment Data!')
            this.loading = false;
            this.refreshKey += 1;
            // this.$router.go(-1);
          })
      }
    }
  },

  watch: {
    dataKey(t) {
      if (t > 0) {
        this.isOpen = true;
      }
    },
    isOpen(t) {
      console.log("open change", this.isOpen);
      if (t) {
      } else {
        this.loading = false;
        this.sampling = 'Random';
        this.assigned_to = '';
        this.error = "";
      }
    },
  },
  data() {
    return {
      isOpen: false,
      sampling: "Random",
      loading: false,
      assigned_to: "",
      error: "",
    };
  },
};
</script>