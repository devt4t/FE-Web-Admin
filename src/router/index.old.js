import Vue from "vue";
import VueRouter from "vue-router";

import exportReport from "@/views/Report/index";
import ViewDistribution from "@/views/Activity/components/distribusi/viewDistribution";

// Area Management
import RegionalAMS from "@/views/AreasManagement/regional/AMSRegional";
import ManagementUnitAMS from "@/views/AreasManagement/management_unit/AMSUnitManager";

import TargetAreaAMS from "@/views/AreasManagement/target_area/AMSFieldCoordinator";
import DesaAMS from "@/views/AreasManagement/desa/AMSFieldFacilitator";
import newScoopings from "@/views/ActivityNew/scooping_visit/ScoopingVisit";
import newRraPra from "@/views/ActivityNew/rra_pra/RraPra";

Vue.use(VueRouter);
function lazyLoad(view) {
  return () => import(`@/views/${view}.vue`);
}
const routes = [
  {
    path: "/Home",
    name: "Home",
    component: "Home",
  },
  {
    path: "/",
    name: "Login",
    component: "Login",
  },
  {
    path: "/RraPra",
    name: "RraPra",
    component: "Activity/RraPra/index",
  },
  {
    path: "/GantiPassword",
    name: "GantiPassword",
    component: "GantiPassword",
  },
  {
    path: "/Dashboard",
    name: "Dashboard",
    component: "Dashboard/index",
  },
  {
    path: "/MainPage",
    name: "MainPage",
    component: "MainPage",
  },
  {
    path: "/Employee",
    name: "Employee",
    component: "Employee/Employee",
  },
  {
    path: "/FieldCoordinator",
    name: "FieldCoordinator",
    component: "Employee/FieldCoordinator/index",
  },
  {
    path: "/FieldFacilitator",
    name: "FieldFacilitator",
    component: "Employee/FF",
  },
  {
    path: "/EmployeeManager",
    name: "EmployeeManager",
    component: "Employee/EmployeeManager",
  },
  {
    path: "/EmployeeMenu",
    name: "EmployeeMenu",
    component: "Employee/EmployeeMenu",
  },
  {
    path: "/EmployeePosition",
    name: "EmployeePosition",
    component: "Employee/EmployeePosition",
  },
  {
    path: "/Farmer",
    name: "Farmer",
    component: "Farmer/Farmer",
  },
  {
    path: "/Lahan",
    name: "Lahan",
    component: "Lahan/Lahan",
  },
  {
    path: "/Donor",
    name: "Donor",
    component: "Donor/Donor",
  },
  {
    path: "/LahanUmum",
    name: "LahanUmum",
    component: "Lahan/LahanUmum",
  },
  {
    path: "/TruckDriver",
    name: "TruckDriver",
    component: "TruckDriver/TruckDriver",
  },
  {
    path: "/Project",
    name: "Project",
    component: "Project/Project",
  },
  {
    path: "/Trees",
    name: "Trees",
    component: "Trees/Trees",
  },
  {
    path: "/SosialisasiProgram",
    name: "SosialisasiProgram",
    component: "Activity/SosialisasiProgram/index",
  },
  {
    path: "/ScoopingVisit",
    name: "ScoopingVisit",
    component: "Activity/ScopingVisit/index",
  },
  {
    path: "/SosialisasiTanam",
    name: "SosialisasiTanam",
    component: "Activity/SosialisasiTanam",
  },
  {
    path: "/AdjustmentDataSostam",
    name: "AdjustmentDataSostam",
    component: "Activity/components/sostam/AdjustmentDataSostam",
  },
  {
    path: "/populateDataMonitoring1",
    name: "populateDataMonitoring1",
    component: "Activity/monitoring2AddIn/populateDataMonitoring1",
  },
  {
    path: "/PelatihanPetani",
    name: "PelatihanPetani",
    component: "Activity/PelatihanPetani",
  },
  {
    path: "/Progression",
    name: "Progression",
    component: "Activity/Progression",
  },
  {
    path: "/LubangTanam",
    name: "LubangTanam",
    component: "Activity/LubangTanam",
  },
  {
    path: "/MaterialOrganik",
    name: "MaterialOrganik",
    component: "Activity/MaterialOrganik",
  },
  {
    path: "/PenilikanTanam",
    name: "PenilikanTanam",
    component: "Activity/PenilikanTanam",
  },
  {
    path: "/SeedlingChangeRequest",
    name: "SeedlingChangeRequest",
    component: "Activity/components/distribusi/SeedlingChangeRequest/index",
  },
  {
    path: "/Distribusi",
    name: "Distribusi",
    component: "Activity/Distribusi",
  },
  {
    path: "/Monitoring2",
    name: "Monitoring2",
    component: "Activity/Monitoring2",
  },

  {
    path: "/Provinsi",
    name: "Provinsi",
    component: "Utilities/Provinsi",
  },
  {
    path: "/Kabupaten",
    name: "Kabupaten",
    component: "Utilities/Kab",
  },
  {
    path: "/Kecamatan",
    name: "Kecamatan",
    component: "Utilities/Kecamatan",
  },
  {
    path: "/Vilage",
    name: "Vilage",
    component: "Utilities/Vilage",
  },
  {
    path: "/Regional",
    name: "Regional",
    component: "Utilities/Regional",
  },

  {
    path: "/ManagementUnit",
    name: "ManagementUnit",
    component: "Utilities/MU",
  },
  {
    path: "/TargetArea",
    name: "TargetArea",
    component: "Utilities/TA",
  },
  {
    path: "/Pekerjaan",
    name: "Pekerjaan",
    component: "Utilities/Pekerjaan",
  },

  // project
  {
    path: "/ProjectTypes",
    name: "ProjectTypes",
    component: "Utilities/ProjectTypes",
  },
  {
    path: "/ProjectPlantingPurpose",
    name: "ProjectPlantingPurpose",
    component: "Utilities/ProjectPlantingPurpose",
  },
  {
    path: "/ProjectPlantingEnvironment",
    name: "ProjectPlantingEnvironment",
    component: "Utilities/ProjectPlantingEnvironment",
  },

  {
    path: "/Suku",
    name: "Suku",
    component: "Utilities/Suku",
  },
  {
    path: "/Users",
    name: "Users",
    component: "Users/Users",
  },
  {
    path: "/PermintaanTutupanLahan",
    name: "PermintaanTutupanLahan",
    component: "Lahan/tutupanLahan",
  },
  {
    path: "/DaftarQRLahanRusak",
    name: "DaftarQRLahanRusak",
    component: "Lahan/QrLahanRusak",
  },
  {
    path: "/report-data",
    name: "ReportData",
    component: exportReport,
  },
  {
    path: "/LihatTanggalDistribusi",
    name: "LihatTanggalDistribusi",
    component: ViewDistribution,
  },
  {
    path: "/AssignManagementAreaRegional",
    name: "AssignManagementAreaRegional",
    component: RegionalAMS,
  },
  {
    path: "/AssignManagementAreaMU",
    name: "AssignManagementAreaMU",
    component: ManagementUnitAMS,
  },

  //NEW ACTIVITY
  {
    path: "/newScoopingVisit",
    name: "newScoopingVisit",
    component: newScoopings,
  },
  {
    path: "/newRraPra",
    name: "newRraPra",
    component: newRraPra,
  },
  {
    path: "/newPra",
    name: "newPra",
    component: newRraPra,
  },
  // {
  //   path: '/AssignManagementAreaDesa',
  //   name: 'AssignManagementAreaDesa',
  //   component: DesaAMS
  // },
];

const router = new VueRouter({
  // mode: 'history',
  routes,
});

export default router;
