<template>
  <v-dialog v-model="isOpen" width="70%">
    <template v-slot:default="{ isActive }">
      <v-card>
        <v-card-title>
          <span>Assign Petani</span>
        </v-card-title>

        <v-card-text class="farmer-assign-wrapper mt-3">
          <ValidationObserver ref="firstForm" v-slot="{ handleSubmit }">
            <form @submit.prevent="handleSubmit(onSubmit)" autocomplete="off">
              <v-row>
                <v-col lg="12">
                  <v-btn
                    variant="success"
                    @click="addRow"
                    v-if="$_sys.isAllowed('farmer-update')"
                  >
                    <v-icon>mdi-plus</v-icon>
                    <span>Tambah Tahun Program</span>
                  </v-btn>
                </v-col>
                <v-col lg="12" v-for="(f, i) in farmers">
                  <v-row>
                    <v-col lg="6">
                      <geko-input
                        v-model="f.key1"
                        :item="{
                          label: 'Nama FF',
                          type: 'select',
                          api: 'GetFFAllWeb_new',
                          validation: ['required'],
                          setter: 'key1',
                          option: {
                            default_label: f.field_facilitators_name,
                            list_pointer: {
                              code: 'ff_no',
                              label: 'name',
                              display: ['name'],
                            },
                          },
                        }"
                        :disabled="f.id ? true : false"
                      />
                    </v-col>
                    <v-col
                      lg="5"
                      v-if="!$_sys.isAllowed('farmer-unassign-it-create')"
                    >
                      <geko-input
                        v-model="f.program_year"
                        :item="{
                          label: 'Tahun Program',
                          type: 'select',
                          validation: ['required'],
                          option: {
                            default_label: f.program_year,
                            default_options: $_config.programYear.options.map(
                              (x) => {
                                return {
                                  label: x,
                                  code: x,
                                };
                              }
                            ),
                            list_pointer: {
                              label: 'label',
                              code: 'code',
                              display: ['label'],
                            },
                          },
                        }"
                        :disabled="f.id ? true : false"
                      />
                    </v-col>

                    <v-col lg="5" v-else>
                      <geko-input
                        v-model="f.program_year"
                        :item="{
                          label: 'Tahun Program',
                          type: 'text',
                          validation: ['required'],
                        }"
                      />
                    </v-col>
                    <v-col
                      lg="1"
                      style="
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        transform: translateY(10%);
                      "
                    >
                      <v-btn
                        v-if="
                          $_sys.isAllowed('farmer-unassign-it-create') ||
                          (!$_sys.isAllowed('farmer-unassign-it-create') &&
                            !f.id)
                        "
                        variant="danger"
                        :disabled="
                          loading ||
                          (f.program_year == '2024' && farmers.length == 1)
                        "
                        @click="onDelete(f, i)"
                      >
                        <v-icon>mdi-delete-empty</v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-col>

                <v-col lg="12" class="d-flex flex-row justify-content-center">
                  <v-btn
                    variant="warning"
                    type="submit"
                    class="mt-3"
                    :disabled="loading"
                  >
                    <v-icon>mdi-pencil-outline</v-icon>
                    <span>Perbarui Data Petani</span>
                  </v-btn>
                </v-col>
              </v-row>
            </form>
          </ValidationObserver>
        </v-card-text>
      </v-card>
    </template>
  </v-dialog>
</template>

<script>
export default {
  name: "farmer-assign-modal",
  props: {
    data: {
      required: true,
      default: () => {},
    },
    dataKey: {
      required: true,
      default: 0,
      type: Number,
    },
  },

  methods: {
    onOpen() {
      this.farmers = this.data;
    },
    editProgramYear(payload) {
      return new Promise(async (resolve, reject) => {
        try {
          await this.$_api
            .post("UpdateMainPivotProgramYear_new", payload)
            .then(() => {
              resolve();
            })
            .catch((err) => {
              throw err;
            });
        } catch (error) {
          console.log("err", error);

          return reject();
        }
      });
    },

    onClose() {
      this.ffData = null;
      this.loading = false;
      this.farmers = [];
    },
    async onSubmit() {
      if (this.loading) return;

      this.loading = true;

      let originYear =
        this.$store.state.tmpProgramYear ||
        localStorage.getItem("tmpProgramYear");

      if (!originYear) {
        this.$_alert.error({}, "Gagal", "Origin year tidak ditemukan");
        this.loading = false;
        return;
      }

      let ffs = [];
      let years = [];
      let successList = [];
      let failedList = [];

      for (const farmer of this.farmers) {
        if (ffs.includes(farmer.key1)) {
          this.$_alert.error(
            "",
            "Duplicate FF",
            `Terdapat duplikat FF dengan nama kode FF ${farmer.key1}`
          );
          this.loading = false;
          return;
        }

        if (years.includes(farmer.program_year)) {
          this.$_alert.error(
            "",
            "Duplicate Tahun Program",
            `Terdapat duplikat tahun program ${farmer.key1}`
          );
          this.loading = false;
          return;
        }

        if (originYear == farmer.program_year && !farmer.id) {
          this.$_alert.error(
            "",
            "Error",
            `Tahun program tidak boleh sama dengan tahun asal`
          );
          this.loading = false;
          return;
        }

        ffs.push(farmer.key1);
        years.push(farmer.program_year);
      }

      for (const farmer of this.farmers) {
        if (farmer.id) {
          if (this.$_sys.isAllowed("farmer-unassign-it-create")) {
            await this.editProgramYear({
              id: farmer.id,
              program_year: farmer.program_year,
            })
              .then(() => successList.push(farmer.program_year))
              .catch(() => failedList.push(farmer.program_year));
          }
        } else {
          await this.$_api
            .post("UpdateFarmerPivot_new", {
              ff_no: farmer.key1,
              farmer_no: farmer.key2,
              program_year: farmer.program_year,
              origin_year: originYear,
            })
            .then(() => successList.push(farmer.program_year))
            .catch(() => failedList.push(farmer.program_year));
        }
      }

      if (successList.length > 0) {
        this.$_alert.success(
          "Berhasil",
          `Data tahun program petani berhasil diperbarui ${successList.join(
            ", "
          )}. ${
            failedList.length > 0
              ? `Data gagal diperbarui : ${failedList.length}`
              : ""
          }`,
          "center",
          true
        );
      }

      this.isOpen = false;
      this.$emit("success", true);
      this.loading = false;
    },
    addRow() {
      this.farmers.push({
        id: null,
        type: "ff_farmer",
        active: "1",
        key1: null,
        key2: this.$route.query.farmer_no,
      });
    },
    onDelete(item, i) {
      if (item.program_year == 2024 && this.farmers.length == 1) return;
      if (this.loading) return;
      this.loading = true;

      if (!this.farmers[i].id) {
        this.farmers.splice(i, 1);
        this.loading = false;
        return;
      }
      this.$_alert
        .confirm(
          "Hapus Data?",
          `Apakah anda yakin ingin menghapus data petani di tahun program ${item.program_year}?`,
          "Ya, Hapus",
          "Batal",
          true
        )
        .then((res) => {
          if (res.isConfirmed) {
            // ff_no, farmer_no, program_year
            this.$_api
              .post("UnassignFarmerPivot_new", {
                farmer_no: item.key2,
                ff_no: item.key1,
                program_year: item.program_year,
                pivot_id: item.id,
              })
              .then(() => {
                this.$_alert.success(
                  "Data tahun program petani berhasil dihapus"
                );
                // this.isOpen = false;
                // this.$emit("success", true);
                this.farmers.splice(i, 1);
                this.loading = false;
              })
              .catch(() => {
                this.loading = false;
              });
          } else {
            this.loading = false;
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },

  watch: {
    dataKey(t) {
      if (t > 0) {
        this.isOpen = true;
      }
    },
    isOpen(t) {
      if (t) {
        this.onOpen();
      } else {
        this.onClose();
      }
    },
  },
  data() {
    return {
      isOpen: false,
      ffData: null,
      loading: false,
      farmers: [],
    };
  },
};
</script>
