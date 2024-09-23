import defaultData from "./ScoopingVisitData";

export default {
  name: "scooping-visit-form",
  data() {
    return {
      ready: false,
      isCreate: null,
      loading: false,
      existingProjectIds: [],
      existingFfIds: [],
      form: 1,
      formData: {
        village_persons: [
          {
            name: "",
            position: "",
            phone: "",
            whatsapp: "",
            dat_no: "",
          },
        ],
        other_ngo_input: "",
        other_ngo_data: [],
        ff_candidates: [],
        
      },
    };
  },

  mounted() {
    this.isCreate = this.$route.query.view === "create";
    if (this.isCreate) {
      this.ready = true;
    } else {
      this.initData();
    }
  },

  watch: {
    form(t) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    },

  },
  methods: {
    onChangeProvince(data) {
      this.$set(this.formData, "province_code", data.province_code);
      if (data.province_code === "JB") {
        this.$set(this.formData, "project_id", [
          {
            code: 22,
            project_name: "AZ Preliminary Project - PJ00008",
          },
        ]);
      }
    },
    async initData() {
      const resData = await this.$_api.get("GetDetailScoopingVisit_new", {
        id: this.$route.query.id,
      });

      const figures = await this.$_api.get(
        "GetDetailScoopingVisitFigures_new",
        { data_no: resData.data.data_no }
      );

      const resProject = await this.$_api.get(
        "GetDetailScoopingVistiProject_new",
        { data_no: resData.data.data_no }
      );

      const resFf = await this.$_api.get(
        "GetDetailScoopingVisitFFCandidate_new",
        { data_no: resData.data.data_no }
      );
      const keys = [
        ["province", "province_id"],
        ["province", "province_code"],
        ["provinces_name", "province_name"],
        ["kabupatens_kabupaten_no", "city_id"],
        ["kabupatens_name", "city_name"],
        ["kabupatens_kabupaten_no", "city_code"],
        ["kecamatans_kode_kecamatan", "district_id"],
        ["data_no", "data_no"],
        ["kecamatans_kode_kecamatan", "district_id"],
        ["kecamatans_kode_kecamatan", "district_code"],
        ["kecamatans_name", "district_name"],
        ["desas_kode_desa", "village_id"],
        ["desas_name", "village_name"],
        ["desas_kode_desa", "village_code"],
        ["desas_kode_desa", "village_code"],
        ["date", "date", "daterange"],
        ["end_date", "end_scooping_date"],
        ["accessibility", "accessibility"],
        ["land_area", "village_area"],
        // ["land_type", "land_type"],
        // ["slope", "slope", "array"],
        // ["altitude", "altitude"],
        ["vegetation_density", "vegetation_density", "array"],
        ["water_source", "water_source", "array"],
        // ["rainfall", "rainfall", "array"],
        ["agroforestry_type", "agroforestry_type", "array"],
        ["goverment_place", "goverment_place", "array"],
        ["land_coverage", "land_coverage", "array"],
        ["electricity_source", "electricity_source", "array"],
        ["dry_land_area", "land_area"],
        // ["village_polygon", "village_polygon"],
        // ["dry_land_polygon", "dry_land_polygon"],
        ["total_dusun", "total_dusun"],
        ["potential_dusun", "potential_dusun"],
        ["potential_description", "potential_description"],
        ["total_male", "total_male"],
        ["total_female", "total_female"],
        ["total_kk", "total_kk"],
        ["photo_road_access", "photo_road_access", "array"],
        ["photo_meeting", "photo_meeting", "array"],
        ["photo_dry_land", "photo_dry_land", "array"],
        ["village_profile", "village_profile"],
        ["status", "status"],
        ["complete_data", "complete_data"],
        // ["project_id", "project_id"],
        ["projects_project_no", "project_code"],
        ["data_no", "data_no"],
        ["other_ngo", "other_ngo"],
        ["mitigation_program", "mitigation_program"],
        ["resident_acceptance", "resident_acceptance"],
        ["general_land_condition", "general_land_condition"],
        ["next_event_contact_person", "next_event_contact_person"],
        ["ff_candidate", "ff_candidate"],
        ["field_companion_potency", "field_companion_potency"],
      ];

      for (const key of keys) {
        let _value = resData.data[key[0]];
        let _key = key[0];
        if (key.length > 1) {
          _key = key[1];
        }

        if (key.length > 2 && key[2] === "array") {
          if (typeof resData.data[key[0]] == "string") {
            _value = resData.data[key[0]].split(",");
          }
        }

        if (key.length > 2 && key[2] === "daterange") {
          _value = [
            resData.data.start_scooping_date,
            resData.data.end_scooping_date,
          ];
        }

        if (key[0] === "land_area") {
          this.$set(this.formData, _key, parseInt(_value));
        } else {
          this.$set(this.formData, _key, _value);
        }
      }

      let existingProject = [];
      for (const d of resProject.data) {
        this.existingProjectIds.push(d.project_id);
        existingProject.push({
          project_name: `${d.projects_project_name} - ${d.scooping_id}`,
          code: d.project_id,
        });
      }

      if (existingProject.length == 0 && this.formData.province_code === "JB") {
        existingProject.push({
          code: 22,
          project_name: "AZ Preliminary Project - PJ00008",
        });
      }
      this.$set(this.formData, "project_id", existingProject);
      this.$set(this.formData, "village_persons", figures.data);
      this.$set(this.formData, "ff_candidates", resFf.data);
      this.ready = true;
    },
    onSubmit() {
      if (this.form < 3) {
        this.form = this.form + 1;
        return;
      }

      if (this.loading) return;

      this.loading = true;

      let payload = {
        program_year: this.$store.state.programYear.model,
        province: this.formData.province_code,
        city: this.formData.city_code,
        district: this.formData.district_code,
        village: this.formData.village_code,
        start_date:
          Array.isArray(this.formData.date) && this.formData.date.length > 1
            ? this.formData.date[0]
            : null,
        end_date:
          Array.isArray(this.formData.date) && this.formData.date.length > 1
            ? this.formData.date[1]
            : null,
        accessibility: this.formData.accessibility,
        land_area: this.formData.village_area,
        slope: this.formData.slope,
        altitude: this.formData.altitude,
        dry_land_area: parseInt(this.formData.land_area),
        village_polygon: this.formData.village_polygon,
        dry_land_polygon: this.formData.dry_land_polygon,
        total_dusun: this.formData.total_dusun,
        potential_dusun: this.formData.potential_dusun,
        potential_description: this.formData.potential_description,
        total_male: parseInt(this.formData.total_male),
        total_female: parseInt(this.formData.total_female),
        total_kk: parseInt(this.formData.total_kk),
        village_profile: this.formData.village_profile,
        status: "document_saving",
        complete_data: 0,
        user_email: this.$store.state.User.email,
        other_ngo: this.formData.other_ngo,
        mitigation_program: parseInt(this.formData.mitigation_program),
        resident_acceptance: this.formData.resident_acceptance,
        next_event_contact_person: this.formData.next_event_contact_person,
        general_land_condition: this.formData.general_land_condition,
        field_companion_potency: this.formData.field_companion_potency,
        ff_candidate: this.formData.ff_candidate,
      };

      const keyJoins = [
        "land_type",
        "vegetation_density",
        "water_source",
        "rainfall",
        "agroforestry_type",
        "goverment_place",
        "land_coverage",
        "electricity_source",
        "photo_road_access",
        "photo_meeting",
        "photo_dry_land",
      ];

      for (const _key of keyJoins) {
        if (Array.isArray(this.formData[_key])) {
          payload[_key] = this.formData[_key].join(",");
        }
      }

      const endpoint = this.isCreate
        ? "AddScoopingVisit_new"
        : "UpdateScoopingVisit_new";

      if (!this.isCreate) {
        payload.current_id = this.$route.query.id;
        payload.data_no = this.formData.data_no;
      }
      this.$_api
        .post(endpoint, payload)
        .then((res) => {
          if (!res.kode_scooping) {
            res.kode_scooping = this.formData.data_no;
          }
          this.submitProject(res);

          this.submitOtherNgo(res);
          this.submitFfCandidate(res);
          this.submitFigure(res);
        })
        .catch((err) => {
          console.log("err", err);
          this.$_alert.error(err);
          this.loading = false;
        });
    },

    submitOtherNgo(res = {}) {
      for (const ngo of this.formData.other_ngo_data) {
        if (typeof ngo == "object") {
          continue;
        }
        ngo.scooping_no = res.kode_scooping;

        this.$_api.post("AddScoopingVisitNGOCompetitor_new", ngo);
      }
    },

    submitProject(res = {}) {
      for (let _project of this.formData.project_id) {
        const _projectId =
          typeof _project === "object" ? _project.code : _project;
        const isCreate = !this.existingProjectIds.includes(_projectId);
        if (!isCreate){

          const projectPayload = {
            data_no: res.kode_scooping ?? this.formData.data_no,
            project_id: parseInt(_projectId),
            delete_type: 'hard_delete'
          };
          const endpoint = "DeleteScoopingVisitProject_new";
          this.$_api.post(endpoint, projectPayload).catch((err) => {
            console.log("err", err);
          });
        };

        const projectPayload = {
          data_no: isCreate ? res.kode_scooping : this.formData.data_no,
          project_id: parseInt(_projectId),
        };
        const endpoint = isCreate
          ? "AddScoopingProject_new"
          : "UpdateScoopingVisitProject_new";
        this.$_api.post(endpoint, projectPayload).catch((err) => {
          console.log("err", err);
        });
      }
    },


    submitFigure(res = {}) {
      var i = 0;

      if (this.formData.village_persons.length == 0) {
        this.$_alert.success(
          `Data scooping visit berhasil ${
            this.isCreate ? "ditambahkan" : "diperbarui"
          }`
        );
        this.$router.replace({
          path: $route.path,
          query: {
            view: "list",
          },
        });
        this.loading = false;
      }

      for (const figure of this.formData.village_persons) {
        i += 1;

        figure.data_no = res.kode_scooping;
        const isCreate = !figure.id;
        figure.current_id = figure.id;
        this.$_api
          .post(
            isCreate
              ? "AddScoopingVisitFigures_new"
              : "UpdateScoopingVisitFigures_new",
            figure
          )
          .then(() => {
            if (i == this.formData.village_persons.length) {
              this.$_alert.success(
                `Data scooping visit berhasil ${
                  this.isCreate ? "ditambahkan" : "diperbarui"
                }`
              );
              this.$router.replace({
                path: this.$route.path,
                query: {
                  view: "list",
                },
              });
              this.loading = false;
            }
          });
      }
    },

    submitFfCandidate(res = {}) {
      for (const ff of this.formData.ff_candidates) {
        ff.data_no = res.kode_scooping;
        const isCreate = !ff.id;
        ff.current_id = ff.id;
        this.$_api.post(
          isCreate
            ? "AddScoopingVisitFFCandidate_new"
            : "UpdateScoopingVisitFFCandidate_new",
          ff
        );
      }
    },

    addOtherNgo() {
      if (
        this.formData.other_ngo_data.find(
          (x) => x.name == this.formData.other_ngo_input
        )
      ) {
        return;
      }
      this.formData.other_ngo_data.push({
        name: this.formData.other_ngo_input,
      });
      this.$set(this.formData, "other_ngo_input", "");
    },

    addFfCandidate() {
      this.formData.ff_candidates.push({
        name: "",
        phone: "",
      });
    },

    removeOtherNgo(i) {
      this.formData.other_ngo_data.splice(i, 1);
    },
    removeVillagePerson(i) {
      this.formData.village_persons.splice(i, 1);
    },
    removeFfCandidate(i) {
      this.formData.ff_candidates.splice(i, 1);
    },

    addVillagePerson() {
      this.formData.village_persons.push({
        name: "",
        position: "",
        phone: "",
        wa: "",
      });
    },
  },

  computed: {
    defaultData() {
      return defaultData;
    },
  },
};
