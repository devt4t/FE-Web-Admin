<template>
    <div>
        <!-- breadcrumbs -->
        <breadcrumbs></breadcrumbs>
		<!-- Dialogs -->
		<createDialog 
			:show="dialogs.create.show" 
			:programYear="programYear" 
			:landProgram="landProgram.model" 
			@close="$event => closeDialogs($event)"
		></createDialog>
		<detailDialog
			:show="dialogs.detail.show"
			:landProgram="landProgram.model"
			:id="dialogs.detail.id"
			:settings="settings"
			@close="$event => closeDialogs($event)"
		></detailDialog>

		<v-data-table
			data-aos="fade-up"
			data-aos-delay="300"
			class="mx-3 rounded-xl"
			:headers="table.headers[landProgram.model]"
			:items="table.items"
			:loading="table.loading"
			:search="table.search"
		>
			<!-- Toolbar -->
			<template v-slot:top>
				<v-row class="align-center justify-center pa-2 pt-3 mx-0">
					<!-- Program Year -->
					<v-select
						color="success"
						item-color="success"
						v-model="programYear"
						:items="$store.state.programYear.options"
						outlined
						dense
						hide-details
						:menu-props="{ bottom: true, offsetY: true, rounded: 'xl', transition: 'slide-y-transition' }"
						rounded
						label="Program Year"
						class="mx-auto mx-lg-2 mr-lg-1 mb-2 mb-lg-0"
						style="max-width: 200px"
						:disabled="table.loading"
					></v-select>
					<!-- Land Program -->
					<v-select
						color="success"
						item-color="success"
						v-model="landProgram.model"
						:items="landProgram.items"
						outlined
						dense
						hide-details
						:menu-props="{ bottom: true, offsetY: true, rounded: 'xl', transition: 'slide-y-transition' }"
						rounded
						:label="landProgram.label"
						class="mx-auto mx-lg-2 mr-lg-1 mb-2 mb-lg-0"
						style="max-width: 200px"
						:disabled="table.loading"
					></v-select>
					<v-spacer class="d-none d-lg-inline-block"></v-spacer>
					<!-- Search Input -->
					<v-text-field
						color="success"
						item-color="success"
						v-model="table.search"
						append-icon="mdi-magnify"
						outlined
						dense
						rounded
						label="Search"
						hide-details
						class="mr-2"
						style="max-width: 300px;"
						:disabled="table.loading"
					></v-text-field>
					<v-btn rounded small color="orange white--text my-1" @click="() => dialogs.create.show = true"><v-icon class="mr-1">mdi-chat-plus</v-icon> Add New Request</v-btn>
				</v-row>
			</template>
			<!-- No Lahan Column -->
			<template v-slot:item.lahan_no="{item}">
				<v-chip v-if="lahanNoFormat(item.lahan_no).length < 2" class="green white--text ma-1">
					{{ lahanNoFormat(item.lahan_no)[0] }}
				</v-chip>
				<v-menu v-else open-on-hover offset-x :close-on-content-click="false" content-class="rounded-xl" >
					<template v-slot:activator="{attrs, on}">
					<v-btn rounded small v-bind="attrs" v-on="on" :color="`green darken-${(lahanNoFormat(item.lahan_no).length - 1) < 5 ? (lahanNoFormat(item.lahan_no).length - 1) : 4} white--text`">
						{{ lahanNoFormat(item.lahan_no).length }} Lahan
					</v-btn>
					</template>
					<v-card class="pa-2 pb-1 d-flex flex-column">
					<v-chip 
						v-for="(lahan, lahanIndex) in lahanNoFormat(item.lahan_no)" 
						:key="lahanIndex"
						color="green white--text"
						class="mb-1"
						style="cursor: auto"
					>
						{{ lahan }}
					</v-chip>
					</v-card>
				</v-menu>
			</template>
			<!-- request_no column -->
			<template v-slot:item.request_no="{item}">
				<v-tooltip right content-class="rounded-xl">
					<template v-slot:activator="{ on, attrs }">
						<v-chip v-bind="attrs" v-on="on" :color="statusColorAndIcon(item.status, 'color', 'request')" style="text-transform: uppercase;">
							<v-icon class="mr-1">{{ statusColorAndIcon(item.status, 'icon', 'request') }}</v-icon>
							{{ item.request_no }}
						</v-chip>
					</template>
					Requested By: {{ item.created_by }}
				</v-tooltip>
			</template>
			<!-- status verified column -->
			<template v-slot:item.verification="{item}">
				<v-chip :color="statusColorAndIcon(item.verification, 'color', 'verification')" class="pl-1" style="text-transform: uppercase;">
					<v-icon class="mr-1">{{ statusColorAndIcon(item.verification, 'icon', 'verification') }}</v-icon>
					{{ statusColorAndIcon(item.verification, 'text', 'verification') }}
				</v-chip>
			</template>
			<!-- action column -->
			<template v-slot:item.actions="{item}">
				<v-menu content-class="rounded-xl">
					<template v-slot:activator="{attrs, on}">
						<v-btn v-bind="attrs" v-on="on" small fab icon>
						<v-icon>mdi-dots-vertical</v-icon>
						</v-btn>
					</template>
					<v-card class="pa-2 d-flex align-stretch flex-column justify-center">
						<v-btn 
							color="info white--text" 
							rounded 
							small class="pl-1 d-flex justify-start align-center" @click="() => {showDetailDialog(item)}"
						>
							<v-icon class="mr-1">mdi-information</v-icon> Detail
						</v-btn>
					</v-card>
				</v-menu>
			</template>
		</v-data-table>

		<v-snackbar
			v-model="snackbar.show"
			:color="snackbar.color"
			:timeout="snackbar.timeout"
			rounded="xl"
			class="d-flex"
		>
			<div class="d-flex justify-between">
				<p class="mb-0">
					{{ snackbar.text }}
				</p>
				<v-spacer></v-spacer>
				<v-icon small class="pl-1" @click="() => snackbar.show = false">mdi-close-circle</v-icon>
			</div>
		</v-snackbar>
    </div>
</template>

<script>
import axios from 'axios';
import breadcrumbs from './breadcrumbs.vue';
import createDialog from './dialogs/create.vue';
import detailDialog from './dialogs/detail.vue';

export default {
	components: {
		breadcrumbs,
		createDialog,
		detailDialog
	},
    data: () => ({
		landProgram: {
			label: 'Land Program',
			items: ['Petani', 'Umum'],
			model: 'Petani'
		},
		programYear: '',
		dialogs: {
			create: {
				show: false
			},
			detail: {
				id: '',
				show: false,
			}
		},
		table: {
			headers: {
				Petani: [
					{text: 'Request No', value: 'request_no'},
					{text: 'Nursery', value: 'nursery'},
					{text: 'Management Unit', value: 'mu_name'},
					{text: 'FF', value: 'ff_name'},
					{text: 'Farmer', value: 'farmer_name'},
					{text: 'Lahan No', value: 'lahan_no'},
					{text: 'Status', value: 'verification'},
					{text: 'Actions', value: 'actions', align: 'right'},
				],
				Umum: [
					{text: 'Request No', value: 'request_no'},
					{text: 'Nursery', value: 'nursery'},
					{text: 'Management Unit', value: 'mu_name'},
					{text: 'PIC T4T', value: 'pic_t4t_name'},
					{text: 'PIC Lahan', value: 'pic_lahan'},
					{text: 'Lahan No', value: 'lahan_no'},
					{text: 'Status', value: 'verification'},
					{text: 'Actions', value: 'actions', align: 'right'},
				]
			},
			items: [],
			loading: false,
			search: ''
		},
        settings: {
            prefixUrl: 'SeedlingChangeRequest/',
			apiConfig: {}
        },
        snackbar: {
            color: 'green',
            timeout: 5000,
            show: false,
            text: 'Alert!',
			multiLine: false,
        },
		User: {}
	}),
	watch: {
		'landProgram.model': {
			async handler() {
				await this.initialize()
			}
		}
	},
	async mounted() {
		this.programYear = this.$store.state.programYear.model
		this.settings.apiConfig = this.$store.state.apiConfig

		await this.initialize()
		this.User = this.$store.state.User
		// const taskForceEmails = this.$store.state.taskForceTeam.emails || []

		if (this.User.role_group != 'IT') {
			this.$store.state.maintenanceOverlay = true
		}
	},
	destroyed() {
		this.$store.state.maintenanceOverlay = false

		this.$store.state.loadingOverlay = false
		this.$store.state.loadingOverlayText = null
	},
	methods: {
		async initialize() {
			await this.getRequests()
		},
		async getRequests() {
			try {
				this.table.loading = true
				this.table.items = []

				const params = new URLSearchParams({
					land_program: this.landProgram.model,
					program_year: this.programYear
				})
				const urlName = this.$store.getters.getApiUrl(`${this.settings.prefixUrl}GetRequests?${params}`)
				const urlConfig = this.$store.state.apiConfig
				const data = await axios.get(urlName, urlConfig).then(res => {return res.data})
				this.table.items = data.list
				console.log(data)
			} catch (err) {
				this.sessionEnd(err)
				console.log(err)
			} finally {
				this.table.loading = false
			}
		},
		// utilities: dialogs action
		async showDetailDialog(data) {
			this.dialogs.detail.id = data.request_no
			this.dialogs.detail.show = true
			// this.dialogs.
		},
		async closeDialogs(data) {
			this.dialogs[data.name].show = false
			if (data.snackbar) {
				this.snackbar = {...data.snackbar}
				if (data.snackbar.color == 'green') this.initialize()
			}
		},
		// Utilities: lahan_no
		lahanNoFormat(lahan_no) {
			return lahan_no.replace('[', '').replace(']', '').split(',')
		},
        // Utilities: session  end
        sessionEnd(error) {
            if (error.response) {
                if (typeof error.response.status != 'undefined') {
                    if (error.response.status == 401) {
                        localStorage.removeItem("token")
                        this.$router.push("/")
                    } else if (error.response.status == 400) {
                        // this.snackbar.multiLine = true
                        this.snackbar.text = error.response.data
                        this.snackbar.color = 'red'
                        this.snackbar.show = true
                    } 
                }
            }
        },
		// utilities: get status request color & icon
		statusColorAndIcon(status, el, type) {
			let data = ''
			if (type == 'request') {
				if (el == 'color') {
					if (status == 'requested') data = 'orange'
					else if (status == 'rejected') data = 'red'
					else data = 'green'
					return data + ' white--text'
				} else {
					if (status == 'requested') data = 'chat-processing'
					else if (status == 'rejected') data = 'chat-remove'
					else data = 'check-decagram'
					return 'mdi-' + data
				}
			} else {
				if (el == 'color') {
					if (status == 0) data = 'red'
					else if (status == 1) data = 'orange'
					else if (status == 2 ) data = 'yellow darken-2'
					else if (status == 3) data = 'green'
					return data + ' white--text'
				} else if ( el == 'icon') {
					if (status == 0) data = 'progress-alert'
					else if (status == 1) data = 'progress-check'
					else if (status == 2 ) data = 'check-circle'
					else if (status == 3) data = 'checkbox-multiple-marked-circle'
					return 'mdi-' + data
				} else {
					if (status == 0) data = 'UNVERIFIED'
					else if (status == 1) data = 'VERIFIED FC'
					else if (status == 2 ) data = 'VERIFIED UM'
					else if (status == 3) data = 'VERIFIED RM / PM'
					return data
				} 
			}
		}
	},
}
</script>