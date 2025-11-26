import moment from "moment";
export default {
  name: "planting-socialization-form",
  components: {},
  mounted() {
    this.getInitialData();
  },
  methods: {
    removeDuplicates(arr) {
      const unique = {};
      return arr.filter((item) => {
        if (!unique[item.ff_no]) {
          unique[item.ff_no] = true;
          return true;
        }
        return false;
      });
    },

    onChangeAttendance(event, value) {
      console.log("event", event, value);

      const _farmerLahan = this.lahans;

      for (const farmer of _farmerLahan) {
        if (value.farmer_no == farmer.farmer_no) {
          farmer.attendance = event;
        }
      }
    },
    getDatesBetween(start, end) {
      const dateArray = []
      const startDate = new Date(start)
      const endDate = new Date(end)

      while (startDate <= endDate) {
        // Format manual ke YYYY-MM-DD
        const year = startDate.getFullYear()
        const month = String(startDate.getMonth() + 1).padStart(2, '0')
        const day = String(startDate.getDate()).padStart(2, '0')

        dateArray.push(`${year}-${month}-${day}`)

        // tambah 1 hari
        startDate.setDate(startDate.getDate() + 1)
      }

      return dateArray
    },
    async onChangeFf(data) {

console.log('DATA CHANGED', data);
      if (!data) {
        return;
      }

      this.ffCurrent = data;
      this.allocations = [];
      this.ffLahanData = [];
      this.loading = true;
      const startDate = moment(this.dateDistributionCurrent, "YYYY-MM-DD")
        .startOf("month")
        .format("YYYY-MM-DD");
      const endDate = moment(this.dateDistributionCurrent, "YYYY-MM-DD")
        .endOf("month")
        .format("YYYY-MM-DD");

      this.availableDate = [];

      let nursery = {
          data: [],
          allocation_periode_days: []
      };

      nursery.data = await this.$_api.get(
          "sostam/calendar/daily-distribution-limit/get",
          {
              mu_no: data.mu_no,
              program_year: this.$store.state.tmpProgramYear,
              // start_date: startDate,
              // end_date: endDate,
          }
      );

      nursery.data = nursery.data.data.result || [];
      
      const ffLahan = await this.$_api.get("getFFLahanSostamNew", {
        ff_no: data.ff_no,
        program_year: this.$store.state.tmpProgramYear,
        type: "new",
      });

      let dates = [];

      for (const data of nursery.data) {

        let date = this.getDatesBetween(
            data.start_distribution_time, 
            data.end_distribution_time
          ).map(date => { return {
                date_allocation: date,
                qty_allocation: data.seed_limitation
          }}) // loop

        dates = dates.concat(date);
        
        console.log('apd',dates)
      }
      nursery.allocation_periode_days = dates;
        
      let allocatedBibitGEKO = await this.$_api.get("/sostam/remaining-seed", {
        month: moment(this.dateDistributionCurrent).month() + 1,
        year: moment(this.dateDistributionCurrent).year(),
        program_year: this.$store.state.tmpProgramYear,
        nursery_location_id: nursery.data[0].nursery_locations_id,
        mu_no: data.mu_no
      });
      
      this.nurseryLocation = {
        address_nursery: '',
        name_location_nursery: this.$store.state.nurseries.find(n => n.id == nursery.data[0].nursery_locations_id)?.name || '',
        location_nursery_id: nursery.data[0].nursery_locations_id,
      };
      
      let totalSeedFF = 0;
      for (const [i,farmer] of ffLahan.data.result.lahans.entries()) {
          totalSeedFF += parseInt(farmer.total_kayu);
          totalSeedFF += parseInt(farmer.total_mpts);
      }

      console.log({ nursery, totalSeedFF, allocatedBibitGEKO });
      let nurseryAllocationList = nursery.allocation_periode_days;
      
      const off_interval = +nursery.data[0].nursery_days_off_interval;
      const off_amount = +nursery.data[0].nursery_days_off_amount;

      if (off_interval > 0 && off_amount > 0) {
        let offIndex = this.getIndicesByInterval(off_interval, off_amount, nurseryAllocationList, off_interval);
        console.log({offIndex})
        nurseryAllocationList = nurseryAllocationList.filter((_, index) => !offIndex.includes(index));
      }

      this.allocations = nurseryAllocationList.filter(
      (nsry) => {
          let pointerGEKO = allocatedBibitGEKO.data.filter(geko => geko.distribution_date === nsry.date_allocation)
          
          let totalBibitNeeded = totalSeedFF;
          totalBibitNeeded += (pointerGEKO.length ? pointerGEKO[0].total_seed : 0)

          let result = (parseInt(nsry.qty_allocation) - totalBibitNeeded) >= 0

          console.log({result, sisa:(parseInt(nsry.qty_allocation) - totalBibitNeeded)})


          return result;
      });

      for (const allocation of this.allocations) {
        this.availableDate.push(allocation.date_allocation);
      }


      let ffLahanData = [];
      try {

        if (ffLahan.data.result.lahans.length == 0) {
          this.$_alert.error("Terdapat lahan yang belum diverifikasi");
          this.loading = false;
          return;
        }

        ffLahanData = ffLahan.data.result.lahans;
      } catch { }

      

      

      var _lastFarmer = "";
      var _index = 1;
      var _totalFarmer = 0;
      var _totalSeed = 0;
      var _totalKayu = 0;
      var _totalMpts = 0;
      for (const _farmer of ffLahanData) {
        _farmer.index = _index;
        if (_lastFarmer != _farmer.farmer_no) {
          _farmer.bordered = true;
          _totalFarmer += 1;

          _index += 1;
        }
        _totalSeed += _farmer.total_kayu;
        _totalSeed += _farmer.total_mpts;
        _totalKayu += _farmer.total_kayu;
        _totalMpts += _farmer.total_mpts;
        _lastFarmer = _farmer.farmer_no;
      }
      this.lahans = ffLahanData;
      this.lahanStatistic = {
        totalFarmer: _totalFarmer,
        totalKayu: _totalKayu,
        totalMpts: _totalMpts,
        totalSeed: _totalSeed,
      };

      //get distribution calendar for this ff
      // const gekoCalendar = await this.$_api.get('DistributionCalendar', {
      //     month: moment().format('MM'),
      //     year: moment().format('YYYY'),
      //     program_year: this.$store.state.tmpProgramYear,
      //     nursery_location_id: null
      // })
      this.validateSostam();
      this.loading = false;
    },

    getIndicesByInterval(interval, indexAmount, array, start = 0) {
      const result = [];

      while (start < array.length) {
        for (let i = 0; i < indexAmount; i++) {
          const index = start + i;
          if (index < array.length) result.push(index);
        }
        start += interval + indexAmount; // lompat ke batch berikutnya
      }

      return result;

    },


    validateSostam() {
      if (!this.ffCurrent) return;

      console.log(this.availableDate);
      console.log("date", this.dateDistributionCurrent);

      const isJateng = [
        "000",
        "001",
        "007",
        "008",
        "013",
        "014",
        "015",
        "016",
        "019",
      ].includes(this.ffCurrent.mu_no);
      const isJabar = ![
        "000",
        "001",
        "007",
        "008",
        "013",
        "014",
        "015",
        "016",
        "019",
      ].includes(this.ffCurrent.mu_no);
    },

    calculatePlantingDate() {
      this.plantingHoleStart = moment(this.formData.distribution_date)
        .subtract(33, "days")
        .format("YYYY-MM-DD");
      this.plantingHoleEnd = moment(this.formData.distribution_date)
        .subtract(7, "days")
        .format("YYYY-MM-DD");
      this.plantingRealizationStart = moment(this.formData.distribution_date)
        .add(1, "days")
        .format("YYYY-MM-DD");
      this.plantingRealizationEnd = moment(this.formData.distribution_date)
        .add(21, "days")
        .format("YYYY-MM-DD");
    },
    getInitialData() {
      return new Promise(async (resolve) => {
        const result = await this.$_api.get("getFFOptionsSostam", {
          typegetdata: "all",
          program_year: this.$store.state.tmpProgramYear,
        });
        result.data.result.forEach((item) => {
          item.name = item.name + " - " + item.ff_no;
        });
        this.ffList = this.removeDuplicates(result.data.result);
        this.ready = true;
        this.loading = false;
        resolve();
      });
    },

    async initializeMap() {
      mapboxgl.accessToken = this.$_config.mapBoxApi;
      this.maps = await new mapboxgl.Map({
        container: "mapContainer",
        style: this.$_config.mapBoxStyle,
        zoom: 12,
        projection: "globe",
        maxZoom: 100,
        preserveDrawingBuffer: true,
        center: [110.41467292861057, -7.024947076120682],
      });

      const geolocate = new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
        showUserHeading: true,
      });
      await this.maps.dragRotate.disable();
      await this.maps.touchZoomRotate.disableRotation();
      await this.maps.addControl(new mapboxgl.FullscreenControl());
      await this.maps.addControl(new mapboxgl.NavigationControl());
      await this.maps.addControl(geolocate);
      this.marker = new mapboxgl.Marker({ color: "red", anchor: "center" })
        .setLngLat([110.41467292861057, -7.024947076120682])
        .addTo(this.maps);
      this.maps.on("click", (data) => {
        this.marker.setLngLat(data.lngLat);
        this.$set(this.formData,'latlng',data.lngLat.lat + " " + data.lngLat.lng)
      });
    },
    async onSubmit() {
      if (this.loading) return;
      this.loading = true;
      const formData = JSON.parse(JSON.stringify(this.formData));
      const _lahans = JSON.parse(JSON.stringify(this.lahans));
      for (const lahan of _lahans) {
        lahan.attendance = lahan.attendance ? 1 : 0;
      }

      let payload = {
        ...formData,
        lahans: this.lahans,
        program_year: this.$store.state.tmpProgramYear,
        distribution_time: moment(formData.distribution_date).format(
          "YYYY-MM-DD"
        ),
        distribution_latitude: this.marker._lngLat.lat,
        distribution_longitude: this.marker._lngLat.lng,
        distribution_rec_armada: formData.rec_armada,
        distribution_coordinates: `${this.marker._lngLat.lat} ${this.marker._lngLat.lng}`,
        planting_time: this.plantingRealizationStart,
        end_planting_time: this.plantingRealizationEnd,
        penlub_time: this.plantingHoleEnd,
        start_pembuatan_lubang_tanam: this.plantingHoleStart,
        nursery_location_id: this.nurseryLocation.location_nursery_id,
        nursery_location_name: this.nurseryLocation.name_location_nursery,
        absent: this.formData.absent1,
      };
      this.loading = false;

      await this.$_api.post("createSostamByFF", payload).then(() => {
        this.loading = false;
        this.$_alert.success("Sosialisasi tanam berhasil dibuat");
        this.$router.go(-1);
      });

      this.loading = false;
    },

    dateDisabled(date) {
      if (this.availableDate.includes(moment(date).format("YYYY-MM-DD"))) {
        return false;
      }
      return true;
    },

    onCalendarPickerChange(date, oldDate, type) {
      const dateDistributionNew = moment(date).format("YYYY-MM-DD");
      if (dateDistributionNew !== this.dateDistributionCurrent) {
        this.dateDistributionCurrent = dateDistributionNew;
        this.onChangeFf(this.ffCurrent);
      }

    },
    isValidCoordinate(lat, lng) {
      const numLat = parseFloat(lat);
      const numLng = parseFloat(lng);

      if (isNaN(numLat) || isNaN(numLng)) return false;
      if (numLat < -90 || numLat > 90) return false;
      if (numLng < -180 || numLng > 180) return false;

      return true;
    }
  },
  watch: {
    ready(val) {
      if (val) {
        setTimeout(() => {
          this.initializeMap();
        }, 1000);
      }
    },
    "formData.distribution_date"(val) {
      if (val) {
        this.calculatePlantingDate();
      }
    },
    async "formData.latlng"(val) {
      if (val.includes(' ')) {
        val=val.split(' ');

        if (!this.isValidCoordinate(val[0],val[1])) return;
        this.marker.setLngLat({
          lat:val[0],
          lng:val[1]
        });
        
        await this.maps.flyTo({ 
          center: [val[1],val[0]], 
          zoom: 13 
        });
      }
    },
  },
  data() {
    return {
      formData: {
        distribution_date: null,
        soc_date: moment().format("YYYY-MM-DD"),
      },
      ready: false,
      loading: true,
      ffList: [],
      allocations: [],
      lahans: [],
      lahanStatistic: {
        totalFarmer: null,
        totalSeed: null,
        totalKayu: null,
        totalMpts: null,
      },
      availableDate: [],
      marker: {},
      dateDistributionCurrent: moment().format("YYYY-MM-DD"),
      ffCurrent: null,
      plantingHoleStart: null,
      plantingHoleEnd: null,
      plantingRealizationStart: null,
      plantingRealizationEnd: null,
      nurseryLocation: null,
      remainingSeedAMonth: [],
      formatDate: (date, format = "YYYY-MM-DD") => {
        return moment(date).format(format);
      },
      maps: {
        center: [113.9213, -0.7893],
        zoom: 3,
        geojson: {},
        key: 111,
        layerId: 0,
        hoveredStateId: 0,
        layerStyle: {
          outline: {
            color: "#000000",
          },
          fill: {
            color: "#f06800",
          },
        },
        popup: {
          model: false,
          content: {
            title: "",
            description: "",
          },
        },
      },
    };
  },
};
