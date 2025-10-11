<template>
  <div class="program-soc-form">
    <ValidationObserver ref="firstForm" v-slot="{ handleSubmit }">
      <form @submit.prevent="handleSubmit(onSubmit)" autocomplete="off">
        <v-row lg="12" class="px-5 py-5">

          <v-col md="12" class="form-separator">
            <h4>Data Identifier</h4>
          </v-col>

          <v-col lg="6">
            <geko-input v-model="formData.code" :item="{
                label: 'Code',
                validation: ['required'],
                type: 'text',
              }" />
          </v-col>

          <v-col lg="6">
            <geko-input v-model="formData.name" :item="{
                label: 'Nama',
                validation: ['required'],
                type: 'text',
              }" />
          </v-col>

          <v-col md="12" class="form-separator">
            <h4>Lokasi Persemaian</h4>
          </v-col>

          <v-col lg="6">
            <geko-input v-model="formData.nursery_locations_id" :item="{
              label: 'Persemaian',
              validation: ['required'],
              col_size: 6,
              type: 'select',
              setter: 'id',
              option: {
                getterKey: 'data',
                default_options: nurseries,
                list_pointer: {
                  code: 'id',
                  label: 'name',
                  display: ['name'],
                },
              },
            }" />
          </v-col>

          <v-col lg="6">
            <geko-input v-model="formData.mu_no" :item="{
              label: 'Management Unit',
              validation: ['required'],
              col_size: 6,
              type: 'select',
              setter: 'mu_no',
              api: 'new-utilities/management-units',
              option: {
                getterKey: 'data',
                list_pointer: {
                  code: 'mu_no',
                  label: 'name',
                  display: ['name'],
                },
              },
            }" />
          </v-col>

          <v-col md="12" class="form-separator">
            <h4>Tanggal Distribusi</h4>
          </v-col>

          <v-col lg="6">
            <geko-input v-model="formData.form_date" :item="{
              label: 'Periode distribusi',
              validation: ['required'],
              type: 'daterange',
              setter: 'date',
            }" />
          </v-col>

          <v-col lg="6">
            <geko-input v-model="formData.program_year" :item="{
              label: 'Tahun Program',
              validation: ['required'],
              type: 'select',
              setter: 'program_year',
              option: {
                default_options: [
                  {
                    name: '2020',
                    value: '2020',
                  },
                  {
                    name: '2021',
                    value: '2021',
                  },
                  {
                    name: '2022',
                    value: '2022',
                  },
                  {
                    name: '2023',
                    value: '2023',
                  },
                  {
                    name: '2024',
                    value: '2024',
                  },
                  {
                    name: '2025',
                    value: '2025',
                  },
                ],

                list_pointer: {
                  code: 'value',
                  label: 'name',
                  display: ['name'],
                },
              },
            }" />
          </v-col>

          <v-col md="12" class="form-separator">
            <h4>Limitasi Bibit</h4>
          </v-col>

          <v-col lg="6">
            <geko-input v-model="formData.wood_limitation" :item="{
                label: 'Limitasi Kayu',
                validation: ['required'],
                type: 'number',
              }" />
          </v-col>

          <v-col lg="6">
            <geko-input v-model="formData.mpts_limitation" :item="{
                label: 'Limitasi MPTS',
                validation: ['required'],
                type: 'number',
              }" />
          </v-col>

          <v-col lg="12">
            <div class="d-flex flex-row" style="justify-content: flex-end">
              <v-btn variant="success" type="submit" :disabled="loading">
                <v-icon>mdi-plus</v-icon>
                <span v-if="isCreate">Tambah Data</span>
                <span v-else>Perbaharui Data</span>
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </form>
    </ValidationObserver>
  </div>
</template>

<script>
import nurseries from './nurseries';

export default {
  name: "daily-distribution-limit-form",
  beforeMount() {
    if (this.$route.query.view === "update") {
      this.isCreate = false;
      this.ready = true;
      this.initData();
    } else {
      this.isCreate = true;
      this.ready = true;
    }
  },
  methods: {
    // async onChangeVillage(data) {
    //   this.potentialStatus = data.scooping_visits_potential_status
    //   if ([2, 3].includes(this.potentialStatus)) {
    //     this.projectPurpose = data.scooping_visits_potential_status
    //   }
    // },
    async onSubmit() {
      if (this.loading) return;
      this.loading = true;

      const endpoint =
        this.$route.query.view == "create"
          ? "sostam/calendar/daily-distribution-limit/create"
          : "sostam/calendar/daily-distribution-limit/update";

      const user = JSON.parse(localStorage.getItem("User"));

      this.formData.start_distribution_time = this.formData.form_date[0];
      this.formData.end_distribution_time = this.formData.form_date[1];
      this.formData.created_by = user.email;
      this.formData.id = this.data?.id;

      this.formData.mu_no = typeof this.formData.mu_no === "string" 
        ? this.formData.mu_no 
        : this.formData.mu_no?.[0]?.mu_no || null;

      console.log("Form submitted with data:", this.formData);
      //insert main program soc
      const resultMain = await this.$_api
        .post(endpoint, this.formData)
        .then((res) => {
          console.log("res", res);

          this.loading = false;
          this.$_alert.success(
            `Data limitasi berhasil ${
              this.$route.query.view === "create" ? "ditambahkan" : "diperbarui"
            }`
          );
          this.$router.replace({
            query: {
              view: "list",
            },
          });

          return res.form_no;
        })
        .catch((err) => {
          this.$_alert.error(err);
          return false;
        });

      if (!resultMain) {
        this.loading = false;
        return;
      }

      //insert farmers
      // for (const farmer of _trees) {
      //   if (!farmer.name || !farmer.status_program) continue;
      //   farmer.form_no = resultMain;
      //   await this.$_api.post("AddFormMinatFarmers_new", farmer);
      // }

      
    },
    async initData() {
      const detailData = await this.$_api.get("sostam/calendar/daily-distribution-limit/detail", {
        id: this.$route.query.id,
      });
      
      this.data = detailData.data;

      const resMUs = await this.$_api.get(
        "new-utilities/management-units",
        {
          mu_no: this.data.mu_no,
        }
      );

      const keys = [
        ['code'],
        ['name'],
        ['nursery_locations_id'],
        ['mu_no'],
        ['form_date'],
        ['program_year'],
        ['wood_limitation'],
        ['mpts_limitation'],
    ];
      // console.log("thi", detailData);

      for (const keyArr of keys) {
        if (keyArr[0] === 'form_date') {
          console.log('this.data[keyArr[0]]', this.data[keyArr[0]], this.data[keyArr[0] + '_end']);
            this.$set(this.formData, keyArr[0], [this.data.start_distribution_time, this.data.end_distribution_time]);
            continue;
        }

        if (keyArr[0] === 'nursery_locations_id') {
          console.log('this.data[keyArr[0]]', this.data[keyArr[0]], this.data[keyArr[0] + '_end']);
            this.$set(this.formData, keyArr[0], this.data.nursery_locations_id);
            continue;
        }

        this.$set(
          this.formData,
          keyArr[0],
          keyArr.length > 1 ? this.data[keyArr[1]] : this.data[keyArr[0]]
        );
        if (keyArr.length > 2) {
          this.$set(this.formData, keyArr[2], this.data[keyArr[2]]);
        }
      }

      let existingMU = [];
      for (const d of resMUs.data.filter((x) => x.mu_no == this.data.mu_no)) {
        existingMU.push({
          name: `${d.name}`,
          mu_no: d.mu_no,
        });
      }

      this.$set(this.formData, "mu_no", existingMU);
      this.ready = true;
    },
    addRow() {
      this.trees.push({
        tree_name: null,
        tree_category: null,
        tree_code: null,
      });
    },

    deleteRow(i) {
      this.trees.splice(i, 1);
    },

    onSelectTree(i, v) {
      if (
        Array.isArray(this.trees[i].trees) &&
        this.trees[i].trees.length > 2
      ) {
        this.$_alert.error(
          {},
          "",
          "Pohon yang dipilih tidak boleh lebih dari 3"
        );
        // this.$set(this.trees[i], "trees", v);
      }
    },
    selectedTree(tree, i) {
    console.log("selectedTree", tree, i);
    if (tree && tree.tree_code) {
      this.$set(this.trees[i], "tree_code", tree.tree_code);
      this.$set(this.trees[i], "tree_name", tree.tree_name);
      this.$set(this.trees[i], "tree_category", tree.tree_category);
    } else {
      this.$set(this.trees[i], "tree_code", null);
      this.$set(this.trees[i], "tree_name", null);
      this.$set(this.trees[i], "tree_category", null);
    }
  }, 
  },

  watch: {
    
  },

  data() {
    return {
      loading: false,
      formData: {
        form_date: "",
        mu_no: "",
        program_year: "2025",
        nursery_locations_id: null,
        wood_limitation: 0,
        mpts_limitation: 0,
        code: null,
        name: null,
        
      },
      projectPurpose: null,
      trees: [
        {
          tree_name: null,
          tree_category: null,
          tree_code: null,
        },
      ],
      nurseries
    };
  },
};
</script>
