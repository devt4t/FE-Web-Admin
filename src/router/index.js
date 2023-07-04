import Vue from 'vue'
import VueRouter from 'vue-router'
import FieldFacilitator from '../views/Employee/FF.vue'
import EmployeeManager from '../views/Employee/EmployeeManager.vue'
import EmployeeMenu from '../views/Employee/EmployeeMenu.vue'
import EmployeePosition from '../views/Employee/EmployeePosition.vue'
import Farmer from '../views/Farmer/Farmer.vue'
import Lahan from '../views/Lahan/Lahan.vue'
import LahanUmum from '../views/Lahan/LahanUmum.vue'
import TruckDriver from '../views/TruckDriver/TruckDriver.vue'
import Trees from '../views/Trees/Trees.vue'
import SosialisasiProgram from '../views/Activity/SosialisasiProgram/index.vue'
import Activity from '../views/Activity/Activity.vue'
import SosialisasiTanam from '../views/Activity/SosialisasiTanam.vue'
import LubangTanam from '../views/Activity/LubangTanam.vue'
import PenilikanTanam from '../views/Activity/PenilikanTanam.vue'
import MaterialOrganik from '../views/Activity/MaterialOrganik.vue'
import Monitoring2 from '../views/Activity/Monitoring2.vue'
import PelatihanPetani from '../views/Activity/PelatihanPetani.vue'
import Progression from '../views/Activity/Progression.vue'
import SeedlingChangeRequest from '../views/Activity/components/distribusi/SeedlingChangeRequest/index.vue'
import ScoopingVisit from '../views/Activity/ScopingVisit/index.vue'

import Provinsi from '../views/Utilities/Provinsi.vue'
import Kabupaten from '../views/Utilities/Kab.vue'
import Kecamatan from '../views/Utilities/Kecamatan.vue'
import Vilage from '../views/Utilities/Vilage.vue'
import ManagementUnit from '../views/Utilities/MU.vue'
import TargetArea from '../views/Utilities/TA.vue'
import Pekerjaan from '../views/Utilities/Pekerjaan.vue'
import Suku from '../views/Utilities/Suku.vue'

import Users from '../views/Users/Users.vue'

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
  // {
  //   path: '/Uploads',
  //   name: 'Login',
  //   component: Login
  // },
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
    path: '/FieldFacilitator',
    name: 'FieldFacilitator',
    component: lazyLoad('Employee/FF')
  },
  {
    path: '/EmployeeManager',
    name: 'EmployeeManager',
    component: EmployeeManager
  },
  {
    path: '/EmployeeMenu',
    name: 'EmployeeMenu',
    component: EmployeeMenu
  },
  {
    path: '/EmployeePosition',
    name: 'EmployeePosition',
    component: EmployeePosition
  },
  {
    path: '/Farmer',
    name: 'Farmer',
    component: Farmer
  },
  {
    path: '/Lahan',
    name: 'Lahan',
    component: Lahan
  },
  {
    path: '/LahanUmum',
    name: 'LahanUmum',
    component: LahanUmum
  },
  {
    path: '/TruckDriver',
    name: 'TruckDriver',
    component: TruckDriver
  },
  {
    path: '/Trees',
    name: 'Trees',
    component: Trees
  },
  {
    path: '/SosialisasiProgram',
    name: 'SosialisasiProgram',
    component: SosialisasiProgram
  },
  {
    path: '/Activity',
    name: 'Activity',
    component: Activity
  },
  {
    path: '/ScoopingVisit',
    name: 'ScoopingVisit',
    component: ScoopingVisit
  },
  {
    path: '/SosialisasiTanam',
    name: 'SosialisasiTanam',
    component: SosialisasiTanam
  },
  {
    path: '/PelatihanPetani',
    name: 'PelatihanPetani',
    component: PelatihanPetani
  },
  {
    path: '/Progression',
    name: 'Progression',
    component: Progression
  },
  {
    path: '/LubangTanam',
    name: 'LubangTanam',
    component: LubangTanam
  },
  {
    path: '/MaterialOrganik',
    name: 'MaterialOrganik',
    component: MaterialOrganik
  },
  {
    path: '/PenilikanTanam',
    name: 'PenilikanTanam',
    component: PenilikanTanam
  },
  {
    path: '/SeedlingChangeRequest',
    name: 'SeedlingChangeRequest',
    component: SeedlingChangeRequest
  },
  {
    path: '/Distribusi',
    name: 'Distribusi',
    component: lazyLoad('Activity/Distribusi')
  },
  {
    path: '/Monitoring2',
    name: 'Monitoring2',
    component: Monitoring2
  },

  
  {
    path: '/Provinsi',
    name: 'Provinsi',
    component: Provinsi
  },
  {
    path: '/Kabupaten',
    name: 'Kabupaten',
    component: Kabupaten
  },
  {
    path: '/Kecamatan',
    name: 'Kecamatan',
    component: Kecamatan
  },
  {
    path: '/Vilage',
    name: 'Vilage',
    component: Vilage
  },
  {
    path: '/ManagementUnit',
    name: 'ManagementUnit',
    component: ManagementUnit
  },
  {
    path: '/TargetArea',
    name: 'TargetArea',
    component: TargetArea
  },
  {
    path: '/Pekerjaan',
    name: 'Pekerjaan',
    component: Pekerjaan
  },
  {
    path: '/Suku',
    name: 'Suku',
    component: Suku
  },
  {
    path: '/Users',
    name: 'Users',
    component: Users
  }
]

const router = new VueRouter({
  // mode: 'history',
  routes,
})

export default router
