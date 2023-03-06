<template>
    <div>
        <!-- breadcrumbs -->
        <breadcrumbs></breadcrumbs>
		<!-- Dialogs -->
		<createDialog :show="dialogs.create.show" @close="$event => closeDialogs($event)"></createDialog>

		<v-data-table
			data-aos="fade-up"
			data-aos-delay="300"
			class="mx-3 rounded-xl"
			:headers="table.headers"
			:items="table.items"
			:loading="table.loading"
		>
			<!-- Toolbar -->
			<template v-slot:top>
				<div class="d-flex align-center pa-2">
					<v-spacer></v-spacer>
					<v-btn rounded small color="orange white--text" @click="() => dialogs.create.show = true"><v-icon class="mr-1">mdi-comment-plus</v-icon> Add New Request</v-btn>
				</div>
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
		dialogs: {
			create: {
				show: false
			}
		},
		table: {
			headers: [
				{text: 'FC', value: ''},
				{text: 'Farmer', value: ''},
				{text: 'Lahan No', value: ''},
				{text: 'Change Type', value: ''},
				{text: 'Status', value: ''},
				{text: 'Actions', value: ''},
			],
			items: [],
			loading: false
		},
		User: {}
	}),
	async mounted() {
		this.User = this.$store.state.User
	// const taskForceEmails = this.$store.state.taskForceTeam.emails || []

	if (this.User.role_group != 'IT' || this.User.email != 'iyas.muzani@trees4trees.org') {
		this.$store.state.maintenanceOverlay = true
	}
	},
	destroyed() {
		this.$store.state.maintenanceOverlay = false

		this.$store.state.loadingOverlay = false
		this.$store.state.loadingOverlayText = null
	},
	methods: {
		async closeDialogs(name) {
			this.dialogs[name].show = false
		}
	},
}
</script>