<template>
  <v-dialog v-model="isOpen" width="70%">
    <template v-slot:default="{ isActive }">
      <v-card>
        <v-card-title>Assign Data Project Scooping </v-card-title>

        <v-card-text class="ff-email-wrapper">
          <ValidationObserver ref="firstForm" v-slot="{ handleSubmit }">
            <form @submit.prevent="handleSubmit(onSubmit)" autocomplete="off">
              <v-row class="assign-project-wrapper" v-if="scooping_data">
                <v-col lg="12" class="form-separator">
                  <div class="d-flex flex-row align-items-center">
                    <p class="mb-0">Pemetaan Project - Program Year</p>
                    <v-btn
                      variant="success"
                      class="add-button ml-2"
                      @click="addProjectProgramYear()"
                      small
                    >
                      <v-icon small>mdi-plus</v-icon>
                    </v-btn>
                  </div>
                </v-col>
                <v-col lg="12" v-for="(ProjectPY, i) in project_programYear" :key="'ProjectPY-' + i" v-if="loading === false">
                  <v-row class="mx-3 bg-grey">
                    <v-col lg="6">
                      <geko-input
                        v-model="ProjectPY.program_year"
                        :item="{
                          label: 'Tahun Program',
                          type: 'select',
                          validation: ['required'],
                          option: {
                            default_label: ProjectPY.program_year,
                            multiple: false,
                            default_options: [
                              {
                                label: '2020',
                                code: '2020',
                              },
                              {
                                label: '2021',
                                code: '2021',
                              },
                              {
                                label: '2022',
                                code: '2022',
                              },
                              {
                                label: '2023',
                                code: '2023',
                              },
                              {
                                label: '2024',
                                code: '2024',
                              },
                              {
                                label: '2025',
                                code: '2025',
                              },
                            ],
                            list_pointer: {
                              label: 'label',
                              code: 'code',
                              display: ['label'],
                            },
                          },
                        }"
                      />
                    </v-col>

                    <v-col lg="5">
                      <geko-input
                        v-model="ProjectPY.id_project"
                        :item="{
                          type: 'select',
                          label: 'Project',
                          validation: ['required'],
                          api: 'GetProjectAllAdmin',
                          default_label: ProjectPY.project_name,
                          option: {
                            list_pointer: {
                              code: 'id',
                              label: 'project_name',
                              display: ['project_name'],
                            },
                          },
                        }"
                      />
                    </v-col>
                    <v-col
                      lg="1"
                      class="mt-0 pt-0 d-flex flex-column"
                      style="
                        justify-content: center;
                        position: relative;
                        transform: translateY(15%);
                      "
                    >
                      <v-btn
                        small
                        variant="danger"
                        class="btn-icon"
                        @click="removeProjectProgramYear(i)"
                      >
                        <v-icon small>mdi-delete-empty</v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col lg="12">
                  <p class="text-danger" v-if="error_project_programYear">
                    {{ error_project_programYear }}
                  </p></v-col
                >
                
              </v-row>

              <v-row>
                <v-col lg="12" class="d-flex flex-row justify-content-center">
                  <v-btn
                    variant="warning"
                    class="d-flex flex-row align-items-center"
                    type="submit"
                  >
                    <v-icon>mdi-pencil-outline</v-icon>
                    <span>Perbarui Data Project Scooping</span>
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
export default {
  name: "scooping-project-program-year",
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
    addProjectProgramYear() {
      this.project_programYear.push({
        scooping_id: this.scooping_data.data_no,
        id_project: null,
        program_year: null,
      });
    },
    removeProjectProgramYear(i) {
      if (!this.project_programYear[i].id) {
        this.project_programYear.splice(i, 1);
        return;
      }
      this.$_alert
        .confirm("Hapus Data Scooping Project - Program Year?", "", "Ya, Hapus", "Batal", true)
        .then((res) => {
          if (res.isConfirmed) {
            this.$_api
              .post("scooping-visit/delete/project", {
                scooping_project_id: this.project_programYear[i].id,
              })
              .then((res) => {
                this.project_programYear.splice(i, 1);
                this.$_alert.success(" Berhasil Hapus Data Project - Program Year Scooping");
                this.$emit("success", true);
              })
              .catch((err) => {
                console.log("err", err);
              });
          }
        });
    },
    onOpen() {
      this.loading = true;

      this.project_programYear = [];
      this.scooping_data = null;

      this.scooping_data = this.data;

      if (this.scooping_data.assigned_projects.length > 0) {
        let ExistingProjects = this.scooping_data.assigned_projects.map(item => {
          return {
            ...item,
            program_year: item.program_year || null,
            project_name: item.project_name || "",
          };
        });
        this.project_programYear = ExistingProjects;
      }

      this.loading = false;
    },


    onSubmit() {
      this.loading = true;
      this.error_project_programYear = "";
      let payloadProjectPY = JSON.parse(JSON.stringify(this.project_programYear));
      // console.log("payloadProjectPY", payloadProjectPY);
      this.$_api
        .post("scooping-visit/update/project-assignment", {project_py: payloadProjectPY})
        .then(() => {
          this.$_alert.success("Berhasil Melakukan Penyesuaian Project Pada Data Scooping");
          this.isOpen = false;
          this.loading = false;
          this.$emit("success", true);
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
        this.loading = false;
        this.error = "";
        this.project_programYear = [];
        this.scooping_data = null;
      }
    }
  },
  data() {
    return {
      isOpen: false,
      loading: false,
      error: "",
      project_programYear: [],
      scooping_data: null,
      error_project_programYear: null,
    };
  },
};
</script>
