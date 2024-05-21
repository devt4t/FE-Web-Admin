export default {
  name: "scooping-visit-form",
  data() {
    return {
      ready: false,
      isCreate: null,
      loading: false,
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
      },
    };
  },

  mounted() {
    this.isCreate = this.$route.query.view === "create";
    if (this.isCreate) {
      this.ready = true;
    }
  },
  methods: {
    testing() {
      console.log(this.formData);
    },
    onSubmit() {
      if (this.form < 3) {
        this.form = this.form + 1;
        return;
      }

      this.loading = true;

      const payload = {
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
        land_area: this.formData.land_area,
        land_type: this.formData.land_type.join(","),
        slope: this.formData.slope,
        altitude: this.formData.altitude,
        vegetation_density: this.formData.vegetation_density.join(","),
        water_source: this.formData.water_source.join(","),
        rainfall: this.formData.rainfall.join(","),
        agroforestry_type: this.formData.agroforestry_type.join(","),
        goverment_place: this.formData.government_place.join(","),
        land_coverage: this.formData.land_coverage.join(","),
        electricity_source: this.formData.electricity_source.join(","),
        dry_land_area: parseInt(this.formData.village_area),
        village_polygon: this.formData.village_polygon,
        dry_land_polygon: this.formData.dry_land_polygon,
        total_dusun: this.formData.total_dusun,
        potential_dusun: this.formData.potential_dusun,
        potential_description: this.formData.potential_description,
        total_male: parseInt(this.formData.total_male),
        total_female: parseInt(this.formData.total_female),
        total_kk: parseInt(this.formData.total_kk),
        photo_road_access: this.formData.photo_road_access.join(","),
        photo_meeting: this.formData.photo_meeting.join(","),
        photo_dry_land: this.formData.photo_dry_land.join(","),
        village_profile: this.formData.village_profile,
        status: "document_saving",
        complete_data: 0,
        project_id: this.formData.project_id,
        user_email: this.$store.state.User.email,
      };

      this.$_api
        .post("AddScoopingVisit_new", payload)
        .then((res) => {
          this.addFigure(res);
        })
        .catch((err) => {
          this.$_alert.error(err);
          this.loading = false;
        });
    },

    addFigure(res) {
      var i = 0;
      for (const figure of this.formData.village_persons) {
        i += 1;
        figure.data_no = res.kode_scooping;
        this.$_api.post("AddScoopingVisitFigures_new", figure).then(() => {
          if (i == this.formData.village_persons.length) {
            this.$_alert.success("Data scooping visit berhasil ditambahkan");
            this.$router.go(-1);
            this.loading = false;
          }
        });
      }
    },
    removeVillagePerson(i) {
      this.formData.village_persons.splice(i, 1);
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
};
