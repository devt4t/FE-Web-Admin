import moment from 'moment'
export default {
    name: "planting-socialization-form",
    components: {

    },
    mounted() {
        this.getInitialData();
    },
    methods: {
        removeDuplicates(arr) {
            const unique = {};
            return arr.filter(item => {
                if (!unique[item.ff_no]) {
                    unique[item.ff_no] = true;
                    return true;
                }
                return false;
            });
        },
        async onChangeFf(data) {
            this.ffCurrent = data
            this.allocations = []
            this.ffLahanData = []
            this.loading = true
            const startDate = moment(this.dateDistributionCurrent, 'YYYY-MM-DD').startOf('month').format('YYYY-MM-DD');
            const endDate = moment(this.dateDistributionCurrent, 'YYYY-MM-DD').endOf('month').format('YYYY-MM-DD');
            const response = await this.$_api.getNursery('custom/gekoDistributionAllocationPeriodes', {
                mu_no: data.mu_no,
                program_year: this.$_config.programYear.model,
                start_date: startDate,
                end_date: endDate

            })

            if (Array.isArray(response.data) && response.data.length > 0 ) {
                this.allocations = response.data[0].allocation_periode_days

                for (const allocation of this.allocations) {
                    this.availableDate.push(allocation.date_allocation)
                }

                console.log('testing',this.availableDate);
                
            }


            //get distribution calendar for this ff
            // const gekoCalendar = await this.$_api.get('DistributionCalendar', {
            //     month: moment().format('MM'),
            //     year: moment().format('YYYY'),
            //     program_year: this.$_config.programYear.model,
            //     nursery_location_id: null
            // })


            const ffLahan = await this.$_api.get('getFFLahanSostamNew', {
                ff_no: data.ff_no,
                program_year: this.$_config.programYear.model
            })
            
            let ffLahanData = []
            try {
                ffLahanData = ffLahan.data.result.lahans
            }
            catch {

            }
            this.lahans = ffLahanData
            this.loading = false
            
        },

        
        calculatePlantingDate() {
            this.plantingHoleStart = moment(this.formData.distribution_date).subtract(40, 'days').format('YYYY-MM-DD')
            this.plantingHoleEnd = moment(this.formData.distribution_date).subtract(14, 'days').format('YYYY-MM-DD')
            this.plantingRealizationStart = moment(this.formData.distribution_date).add(1, 'days').format('YYYY-MM-DD')
            this.plantingRealizationEnd = moment(this.formData.distribution_date).add(21, 'days').format('YYYY-MM-DD')
        },
        getInitialData() {
            return new Promise(async(resolve) => {
                const result = await this.$_api.get('getFFOptionsSostam', {
                    typegetdata: 'all',
                    program_year: this.$store.state.tmpProgramYear
                })
                result.data.result.forEach((item) => {
                    item.name = item.name + ' - ' + item.ff_no
                })
                this.ffList = this.removeDuplicates(result.data.result);
                this.ready = true;
                this.loading = false
                resolve()
            })
        },

        async initializeMap() {
            
            mapboxgl.accessToken = this.$_config.mapBoxApi;
            this.maps = await new mapboxgl.Map({
                container: 'mapContainer',
                style: this.$_config.mapBoxStyleLight,
                zoom: 12,
                projection: "globe",
                maxZoom: 100,
                preserveDrawingBuffer: true,
                center: [
                    110.41467292861057, -7.024947076120682
                ]
            });

            const geolocate = new mapboxgl.GeolocateControl({
                positionOptions: {
                    enableHighAccuracy: true
                },
                trackUserLocation: true,
                showUserHeading: true
            })
            await this.maps.dragRotate.disable();
            await this.maps.touchZoomRotate.disableRotation();
            await this.maps.addControl(new mapboxgl.FullscreenControl());
            await this.maps.addControl(new mapboxgl.NavigationControl());
            await this.maps.addControl(geolocate)
            this.marker = new mapboxgl.Marker({ color: 'red', anchor: 'center' })
            .setLngLat([110.41467292861057, -7.024947076120682])
            .addTo(this.maps);
            this.maps.on('click', (data) => {
                this.marker.setLngLat(data.lngLat)
            })
            
        },
        onSubmit() {
            if (this.loading) return
            this.loading = true;
            const formData = JSON.parse(JSON.stringify(this.formData))
            
            let payload = {
                ...formData,
                lahans: this.lahans,
                program_year: this.$_config.programYear.model,
                distribution_time: moment(formData.distribution_date).format('YYYY-MM-DD'),
                distribution_latitude: this.marker._lngLat.lat,
                distribution_longitude: this.marker._lngLat.lng,
                distribution_rec_armada: formData.rec_armada,
                distribution_coordinate: `${this.marker._lngLat.lat} ${this.marker._lngLat.lng}`,
                planting_time: this.plantingRealizationStart,
                planting_time_end: this.plantingRealizationEnd,
                penlub_time: this.plantingHoleEnd,
                start_pembuatan_lubang_tanam: this.plantingHoleStart
            }
            this.loading = false
            console.log('payload', payload);
            
        },

        dateDisabled(date){

            if (this.availableDate.includes(moment(date).format('YYYY-MM-DD')) ){
                return false
            }
            return true
            
        },

        onCalendarPickerChange(date, oldDate, type) {
            const dateDistributionNew = moment(date).format('YYYY-MM-DD')
            if (dateDistributionNew !== this.dateDistributionCurrent) {
                this.dateDistributionCurrent = dateDistributionNew
                this.onChangeFf(this.ffCurrent)
            }
        }
    },
    watch: {
        'ready' (val) {
            if (val) {
                setTimeout(() => {
                    this.initializeMap()

                }, 1000)
            }
        },
        'formData.distribution_date' (val) {
            if (val) {
                
                this.calculatePlantingDate()
            }
        }
    },
    data() {
        return {
            formData: {
                distribution_date: null,
            },
            ready: false,
            loading: true,
            ffList: [],
            allocations: [],
            lahans: [],
            availableDate: [],
            marker: {},
            dateDistributionCurrent: moment().format('YYYY-MM-DD'),
            ffCurrent: null,
            plantingHoleStart: null,
            plantingHoleEnd: null,
            plantingRealizationStart: null,
            plantingRealizationEnd: null,
            formatDate: (date, format = 'YYYY-MM-DD') => {
                return moment(date).format(format)
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
        }
    },
};