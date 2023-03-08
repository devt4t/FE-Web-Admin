<template>
    <div>
        <!-- breadcrumbs -->
        <breadcrumbs></breadcrumbs>
		<!-- Dialogs -->
		<createDialog :show="dialogs.create.show" :programYear="programYear" :landProgram="landProgram.model" @close="$event => closeDialogs($event)"></createDialog>

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
					></v-text-field>
					<v-btn rounded small color="orange white--text my-1" @click="() => dialogs.create.show = true"><v-icon class="mr-1">mdi-comment-plus</v-icon> Add New Request</v-btn>
				</v-row>
			</template>
		</v-data-table>
    </div>
</template>

<script>
import breadcrumbs from './breadcrumbs.vue';
import createDialog from './dialogs/create.vue';
export default {
	components: {
		breadcrumbs,
		createDialog
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
			}
		},
		table: {
			headers: {
				Petani: [
					{text: 'Nursery', value: 'nursery'},
					{text: 'Management Unit', value: 'mu_name'},
					{text: 'FF', value: 'ff_name'},
					{text: 'Farmer', value: 'farmer_name'},
					{text: 'Lahan No', value: 'lahan_no'},
					{text: 'Status', value: 'verification'},
					{text: 'Actions', value: ''},
				],
				Umum: [
					{text: 'Nursery', value: 'nursery'},
					{text: 'Management Unit', value: 'mu_name'},
					{text: 'PIC T4T', value: 'pic_t4t_name'},
					{text: 'PIC Lahan', value: 'pic_lahan'},
					{text: 'Lahan No', value: 'lahan_no'},
					{text: 'Status', value: 'verification'},
					{text: 'Actions', value: ''},
				]
			},
			items: [],
			loading: false,
			search: ''
		},
		User: {}
	}),
	async mounted() {
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
			this.programYear = this.$store.state.programYear.model
		},
		async closeDialogs(name) {
			this.dialogs[name].show = false
		}
	},
}
</script>