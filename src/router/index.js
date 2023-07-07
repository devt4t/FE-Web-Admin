import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
function lazyLoad(view){
  return() => import(`@/views/${view}.vue`)
}
const routes = [
  {
    path: '/Home',
    name: 'Home',
    component: lazyLoad('Home')
  },
  {
    path: '/',
    name: 'Login',
    component: lazyLoad('Login')
  },
  {
    path: '/RraPra',
    name: 'RraPra',
    component: lazyLoad('Activity/RraPra/index')
  },
  {
    path: '/GantiPassword',
    name: 'GantiPassword',
    component: lazyLoad('GantiPassword')
  },
  {
    path: '/Dashboard',
    name: 'Dashboard',
    component: lazyLoad('Dashboard/index')
  },
  {
    path: '/MainPage',
    name: 'MainPage',
    component: lazyLoad('MainPage')
  },
  {
    path: '/Employee',
    name: 'Employee',
    component: lazyLoad('Employee/Employee')
  },
  {
    path: '/FieldCoordinator',
    name: 'FieldCoordinator',
    component: lazyLoad('Employee/FieldCoordinator/index')
  },
  {
    path: '/FieldFacilitator',
    name: 'FieldFacilitator',
    component: lazyLoad('Employee/FF')
  },
  {
    path: '/EmployeeManager',
    name: 'EmployeeManager',
    component: lazyLoad('Employee/EmployeeManager')
  },
  {
    path: '/EmployeeMenu',
    name: 'EmployeeMenu',
    component: lazyLoad('Employee/EmployeeMenu')
  },
  {
    path: '/EmployeePosition',
    name: 'EmployeePosition',
    component: lazyLoad('Employee/EmployeePosition')
  },
  {
    path: '/Farmer',
    name: 'Farmer',
    component: lazyLoad('Farmer/Farmer')
  },
  {
    path: '/Lahan',
    name: 'Lahan',
    component: lazyLoad('Lahan/Lahan')
  },
  {
    path: '/LahanUmum',
    name: 'LahanUmum',
    component: lazyLoad('Lahan/LahanUmum')
  },
  {
    path: '/TruckDriver',
    name: 'TruckDriver',
    component: lazyLoad('TruckDriver/TruckDriver')
  },
  {
    path: '/Trees',
    name: 'Trees',
    component: lazyLoad('Trees/Trees')
  },
  {
    path: '/SosialisasiProgram',
    name: 'SosialisasiProgram',
    component: lazyLoad('Activity/SosialisasiProgram/index')
  },
  {
    path: '/ScoopingVisit',
    name: 'ScoopingVisit',
    component: lazyLoad('Activity/ScopingVisit/index')
  },
  {
    path: '/SosialisasiTanam',
    name: 'SosialisasiTanam',
    component: lazyLoad('Activity/SosialisasiTanam')
  },
  {
    path: '/PelatihanPetani',
    name: 'PelatihanPetani',
    component: lazyLoad('Activity/PelatihanPetani')
  },
  {
    path: '/Progression',
    name: 'Progression',
    component: lazyLoad('Activity/Progression')
  },
  {
    path: '/LubangTanam',
    name: 'LubangTanam',
    component: lazyLoad('Activity/LubangTanam')
  },
  {
    path: '/MaterialOrganik',
    name: 'MaterialOrganik',
    component: lazyLoad('Activity/MaterialOrganik')
  },
  {
    path: '/PenilikanTanam',
    name: 'PenilikanTanam',
    component: lazyLoad('Activity/PenilikanTanam')
  },
  {
    path: '/SeedlingChangeRequest',
    name: 'SeedlingChangeRequest',
    component: lazyLoad('Activity/components/distribusi/SeedlingChangeRequest/index')
  },
  {
    path: '/Distribusi',
    name: 'Distribusi',
    component: lazyLoad('Activity/Distribusi')
  },
  {
    path: '/Monitoring2',
    name: 'Monitoring2',
    component: lazyLoad('Activity/Monitoring2')
  },

  
  {
    path: '/Provinsi',
    name: 'Provinsi',
    component: lazyLoad('Utilities/Provinsi')
  },
  {
    path: '/Kabupaten',
    name: 'Kabupaten',
    component: lazyLoad('Utilities/Kab')
  },
  {
    path: '/Kecamatan',
    name: 'Kecamatan',
    component: lazyLoad('Utilities/Kecamatan')
  },
  {
    path: '/Vilage',
    name: 'Vilage',
    component: lazyLoad('Utilities/Vilage')
  },
  {
    path: '/ManagementUnit',
    name: 'ManagementUnit',
    component: lazyLoad('Utilities/MU')
  },
  {
    path: '/TargetArea',
    name: 'TargetArea',
    component: lazyLoad('Utilities/TA')
  },
  {
    path: '/Pekerjaan',
    name: 'Pekerjaan',
    component: lazyLoad('Utilities/Pekerjaan')
  },
  {
    path: '/Suku',
    name: 'Suku',
    component: lazyLoad('Utilities/Suku')
  },
  {
    path: '/Users',
    name: 'Users',
    component: lazyLoad('Users/Users')
  }
]

const router = new VueRouter({
  // mode: 'history',
  routes,
})

export default router
