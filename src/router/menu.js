const menu = [
  {
    title: "Dashboard",
    icon: "mdi-view-dashboard",
    component: "Dashboard/index",
    to: "/Dashboard",
    name: "Dashboard",
  },
  {
    title: "Employee",
    icon: "mdi-account-group",
    items: [
      {
        title: "Employee",
        to: "/Employee",
        component: "Employee/Employee",
        name: "Employee",
      },
      {
        title: "Field Coordinator",
        to: "/FieldCoordinator",
        component: "Employee/FieldCoordinator/index",
        name: "FieldCoordinator",
      },
      {
        title: "Field Facilitator",
        to: "/FieldFacilitator",
        component: "Employee/FF",
        name: "FieldFacilitator",
      },
      {
        title: "Employee Menu",
        to: "/EmployeeMenu",
        component: "Employee/EmployeeMenu",
        name: "EmployeeMenu",
      },
      {
        title: "Employee Manager",
        to: "/EmployeeManager",
        component: "Employee/EmployeeManager",
        name: "EmployeeManager",
      },
      {
        title: "Employee Position",
        to: "/EmployeePosition",
        component: "Employee/EmployeePosition",
        name: "EmployeePosition",
      },
    ],
  },
  {
    title: "Main Data",
    icon: "mdi-database",
    items: [
      {
        title: "Farmer",
        to: "/Farmer",
        component: "Farmer/Farmer",
        name: "Farmer",
      },
      {
        title: "Lahan",
        to: "/Lahan",
        component: "Lahan/Lahan",
        name: "Lahan",
      },
      {
        title: "Lahan Umum",
        to: "/LahanUmum",
        component: "Lahan/LahanUmum",
        name: "LahanUmum",
      },
      {
        title: "Donor",
        to: "/Donor",
        component: "Donor/Donor",
        name: "Donor",
      },
      {
        title: "Project",
        to: "/Project",
        component: "Project/Project",
        name: "Project",
      },
      {
        title: "Truck & Driver",
        to: "/TruckDriver",
        component: "TruckDriver/TruckDriver",
        name: "TruckDriver",
      },
    ],
  },
  {
    title: "Activities",
    icon: "mdi-calendar-check",
    items: [
      {
        title: "Progression",
        to: "/Progression",
        component: "Activity/Progression",
        name: "Progression",
      },
      {
        title: "Scooping Visit",
        to: "/ScoopingVisit",
        component: "Activity/ScopingVisit/index",
        name: "ScoopingVisit",
      },
      {
        title: "RRA & PRA",
        to: "/RraPra",
        component: "Activity/RraPra/index",
        name: "RraPra",
      },
      {
        title: "Sosialisasi Program",
        to: "/SosialisasiProgram",
        component: "Activity/SosialisasiProgram/index",
        name: "SosialisasiProgram",
      },
      {
        title: "Sosialisasi Tanam",
        to: "/SosialisasiTanam",
        component: "Activity/SosialisasiTanam",
        name: "SosialisasiTanam",
      },
      {
        title: "AdjustmentDataSostam",
        to: "/AdjustmentDataSostam",
        component: "Activity/components/sostam/AdjustmentDataSostam",
        name: "AdjustmentDataSostam",
        hide: true,
      },
      {
        title: "populateDataMonitoring1",
        to: "/populateDataMonitoring1",
        component: "Activity/monitoring2AddIn/populateDataMonitoring1",
        name: "populateDataMonitoring1",
        hide: true,
      },
      {
        title: "Pelatihan Petani",
        to: "/PelatihanPetani",
        component: "Activity/PelatihanPetani",
        name: "PelatihanPetani",
      },
      {
        title: "Lubang Tanam",
        to: "/LubangTanam",
        component: "Activity/LubangTanam",
        name: "LubangTanam",
      },
      {
        title: "Material Organik",
        to: "/MaterialOrganik",
        component: "Activity/MaterialOrganik",
        name: "MaterialOrganik",
      },
      {
        title: "SeedlingChangeRequest",
        to: "/SeedlingChangeRequest",
        component: "Activity/components/distribusi/SeedlingChangeRequest/index",
        name: "SeedlingChangeRequest",
      },
      {
        title: "Distribusi",
        to: "/Distribusi",
        component: "Activity/Distribusi",
        name: "Distribusi",
      },

      {
        title: "Realisasi Tanam",
        to: "/PenilikanTanam",
        component: "Activity/PenilikanTanam",
        name: "PenilikanTanam",
      },
      {
        title: "Monitoring",
        to: "/Monitoring2",
        component: "Activity/Monitoring2",
        name: "Monitoring2",
      },
      {
        title: "PermintaanTutupanLahan",
        to: "/PermintaanTutupanLahan",
        component: "Lahan/tutupanLahan",
        name: "PermintaanTutupanLahan",
        hide: true,
      },
      {
        title: "DaftarQRLahanRusak",
        to: "/DaftarQRLahanRusak",
        component: "Lahan/QrLahanRusak",
        name: "DaftarQRLahanRusak",
        hide: true,
      },
      {
        title: "Lihat Tanggal Distribusi",
        to: "/LihatTanggalDistribusi",
        component: "Activity/components/distribusi/viewDistribution",
        name: "LihatTanggalDistribusi",
        hide: true,
      },
    ],
  },
  {
    title: "Utilities",
    icon: "mdi-cogs",
    items: [
      {
        title: "Provinsi",
        to: "/Provinsi",
        component: "Utilities/Provinsi",
        name: "Provinsi",
      },
      {
        title: "Kab/Kota",
        to: "/Kabupaten",
        component: "Utilities/Kab",
        name: "Kabupaten",
      },
      {
        title: "Kecamatan",
        to: "/Kecamatan",
        component: "Utilities/Kecamatan",
        name: "Kecamatan",
      },
      {
        title: "Village",
        to: "/Vilage",
        component: "Utilities/Vilage",
        name: "Vilage",
      },
      {
        title: "Management Unit",
        to: "/ManagementUnit",
        component: "Utilities/MU",
        name: "ManagementUnit",
      },
      {
        title: "Target Area",
        to: "/TargetArea",
        component: "Utilities/TA",
        name: "TargetArea",
      },
      {
        title: "Pekerjaan",
        to: "/Pekerjaan",
        component: "Utilities/Pekerjaan",
        name: "Pekerjaan",
      },
      {
        title: "Suku",
        to: "/Suku",
        component: "Utilities/Suku",
        name: "Suku",
      },
      {
        title: "Trees",
        to: "/Trees",
        component: "Trees/Trees",
        name: "Trees",
      },
      {
        title: "Regional",
        to: "/Regional",
        component: "Utilities/Regional",
        name: "Regional",
      },
    ],
  },

  {
    title: "Master Data",
    icon: "mdi-database-cog-outline",
    items: [
      {
        title: "Tipe Project",
        to: "/ProjectTypes",
        component: "Utilities/ProjectTypes",
        name: "ProjectTypes",
      },
      {
        title: "Tujuan Penanaman",
        to: "/ProjectPlantingPurpose",
        component: "Utilities/ProjectPlantingPurpose",
        name: "ProjectPlantingPurpose",
      },
      {
        title: "Media Tanam",
        to: "/ProjectPlantingEnvironment",
        component: "Utilities/ProjectPlantingEnvironment",
        name: "ProjectPlantingEnvironment",
      },
      {
        title: "Task",
        to: "/task",
        component: "MasterData/Tasks",
        name: "Tasks",
      },
      {
        title: "Task Group",
        to: "/task-group",
        component: "MasterData/TaskGroups",
        name: "TaskGroups",
      },
    ],
  },
  {
    title: "Users",
    icon: "mdi-account",
    items: [
      {
        title: "Users",
        to: "/Users",
        component: "Users/Users",
        name: "Users",
      },
      {
        title: "Users",
        to: "/Users",
        component: "Users/Users",
        name: "Users",
      },
    ],
  },
  {
    title: "New Activities",
    icon: "mdi-lightbulb-auto-outline",
    items: [
      {
        title: "New Scooping Visit",
        to: "/newScoopingVisit",
        component: "ActivityNew/scooping_visit/ScoopingVisit",
        name: "newScoopingVisit",
      },
      {
        title: "RRA & PRA",
        to: "/newRraPra",
        component: "ActivityNew/rra_pra/RraPra",
        name: "newRraPra",
      },
    ],
  },

  {
    title: "Report Data",
    icon: "mdi-table-arrow-right",
    component: "Report/index",
    to: "/report-data",
    name: "ReportData",
  },
];

export default menu;
