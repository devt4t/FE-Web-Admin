(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-314dc074"],{"2bc5":function(t,e,a){"use strict";var s=a("5530"),r=(a("a15b"),a("abd3"),a("ade3")),n=a("1c87"),i=a("58df"),o=Object(i["a"])(n["a"]).extend({name:"v-breadcrumbs-item",props:{activeClass:{type:String,default:"v-breadcrumbs__item--disabled"},ripple:{type:[Boolean,Object],default:!1}},computed:{classes:function(){return Object(r["a"])({"v-breadcrumbs__item":!0},this.activeClass,this.disabled)}},render:function(t){var e=this.generateRouteLink(),a=e.tag,r=e.data;return t("li",[t(a,Object(s["a"])(Object(s["a"])({},r),{},{attrs:Object(s["a"])(Object(s["a"])({},r.attrs),{},{"aria-current":this.isActive&&this.isLink?"page":void 0})}),this.$slots.default)])}}),l=a("80d2"),c=Object(l["i"])("v-breadcrumbs__divider","li"),d=a("7560");e["a"]=Object(i["a"])(d["a"]).extend({name:"v-breadcrumbs",props:{divider:{type:String,default:"/"},items:{type:Array,default:function(){return[]}},large:Boolean},computed:{classes:function(){return Object(s["a"])({"v-breadcrumbs--large":this.large},this.themeClasses)}},methods:{genDivider:function(){return this.$createElement(c,this.$slots.divider?this.$slots.divider:this.divider)},genItems:function(){for(var t=[],e=!!this.$scopedSlots.item,a=[],s=0;s<this.items.length;s++){var r=this.items[s];a.push(r.text),e?t.push(this.$scopedSlots.item({item:r})):t.push(this.$createElement(o,{key:a.join("."),props:r},[r.text])),s<this.items.length-1&&t.push(this.genDivider())}return t}},render:function(t){var e=this.$slots.default||this.genItems();return t("ul",{staticClass:"v-breadcrumbs",class:this.classes},e)}})},"672b":function(t,e,a){"use strict";a.r(e);var s=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("v-breadcrumbs",{staticClass:"breadcrumbsmain",attrs:{dark:"dark"==t.$store.state.theme,"data-aos":"fade-right",items:t.breadcrumbs,divider:">",large:""}}),a("FormModal",{key:t.modals.form.key,attrs:{show:t.modals.form.show,id:t.modals.form.data,programYear:t.localConfig.programYear},on:{action:function(e){return t.modalActions(e)},swal:function(e){return t.swalActions(e)}}}),a("DetailModal",{key:t.modals.detail.key,attrs:{show:t.modals.detail.show,id:t.modals.detail.data,programYear:t.localConfig.programYear},on:{action:function(e){return t.modalActions(e)},swal:function(e){return t.swalActions(e)}}}),a("v-data-table",{class:(t.$store.state.theme," rounded-xl elevation-6 mx-3 pa-1"),attrs:{"data-aos":"fade-up","data-aos-delay":"200","multi-sort":"",headers:t.table.headers,items:t.table.items,search:t.table.search,loading:t.table.loading.show,"loading-text":t.table.loading.text,"footer-props":{itemsPerPageText:"Jumlah Data Per Halaman",itemsPerPageOptions:[10,25,40,-1],showCurrentPage:!0,showFirstLastPage:!0}},scopedSlots:t._u([{key:"top",fn:function(){return[a("v-row",{staticClass:"my-2 mx-2 mx-lg-3 align-center"},[a("v-select",{staticClass:"mx-auto mr-lg-2 mb-2 mb-lg-0",staticStyle:{"max-width":"200px"},attrs:{color:"success","item-color":"success",items:t.$store.state.programYear.options,disabled:t.table.loading.show,outlined:"",dense:"","hide-details":"","menu-props":{bottom:!0,offsetY:!0,rounded:"xl",transition:"slide-y-transition"},rounded:"",label:"Tahun Program"},model:{value:t.localConfig.programYear,callback:function(e){t.$set(t.localConfig,"programYear",e)},expression:"localConfig.programYear"}}),a("v-text-field",{staticClass:"mx-auto mb-2 mb-lg-0",attrs:{color:"green","hide-details":"",dense:"",outlined:"",rounded:"",label:"Search",placeholder:"Start type to search...","append-icon":"mdi-magnify"},model:{value:t.table.search,callback:function(e){t.$set(t.table,"search",e)},expression:"table.search"}}),a("v-divider",{staticClass:"mx-2 d-none d-lg-block"}),a("div",{staticClass:"mx-auto"},[a("v-btn",{staticClass:"mr-2",attrs:{color:"green white--text",disabled:t.table.loading.show||0==t.table.items.length,rounded:"",disabled:""},on:{click:function(){return t.exportExcel()}}},[a("v-icon",{staticClass:"mr-1"},[t._v("mdi-microsoft-excel")]),t._v(" Export ")],1),a("v-btn",{staticClass:"pl-2",attrs:{color:"info",rounded:""},on:{click:function(){t.modals.form.show=!0,t.modals.form.key+=1}}},[a("v-icon",{staticClass:"mr-1"},[t._v("mdi-plus-circle")]),t._v(" Tambah ")],1)],1)],1)]},proxy:!0},{key:"item.no",fn:function(e){var a=e.index;return[t._v(" "+t._s(a+1)+" ")]}},{key:"item.land_area",fn:function(e){var a=e.item;return[t._v(" "+t._s(t._utils.numberFormat(a.land_area))+" Ha ")]}},{key:"item.start_scooping_date",fn:function(e){var s=e.item;return[t._v(" "+t._s(t._utils.dateFormat(s.start_scooping_date,"DD MMMM Y"))+" "),s.start_scooping_date!=s.end_scooping_date?a("span",[t._v(" ~ "+t._s(t._utils.dateFormat(s.rra_pra_date_end,"DD MMMM Y"))+" ")]):t._e()]}},{key:"item.is_verify",fn:function(e){var s=e.item;return[a("v-chip",{staticClass:"white--text",attrs:{color:t.getStatusColumn("bg_color",s.status)}},[a("v-icon",{staticClass:"mr-1"},[t._v(t._s(t.getStatusColumn("icon",s.status)))]),t._v(" "+t._s(t.getStatusColumn("text",s.status))+" ")],1)]}},{key:"item.actions",fn:function(e){var s=e.item;return[a("v-menu",{attrs:{"content-class":"rounded-xl"},scopedSlots:t._u([{key:"activator",fn:function(e){var s=e.attrs,r=e.on;return[a("v-btn",t._g(t._b({attrs:{small:"",fab:"",icon:""}},"v-btn",s,!1),r),[a("v-icon",[t._v("mdi-dots-vertical")])],1)]}}],null,!0)},[a("v-card",{staticClass:"pa-2 d-flex align-stretch flex-column justify-center"},[a("v-btn",{staticClass:"pl-1 d-flex justify-start align-center",attrs:{color:"info white--text",rounded:"",small:""},on:{click:function(e){return t.showModal("detail",s)}}},[a("v-icon",{staticClass:"mr-1"},[t._v("mdi-information")]),t._v(" Detail ")],1),a("v-btn",{staticClass:"pl-1 mt-1 d-flex justify-start align-center",attrs:{color:"orange white--text",rounded:"",small:"",disabled:(1===s.is_verify||"submit_review"==s.status)&&"GIS STAFF"!=t.user.role_name},on:{click:function(){t.showModal("form",s)}}},[a("v-icon",{staticClass:"mr-1"},[t._v("mdi-pencil-circle")]),t._v(" Edit ")],1)],1)],1)]}}])})],1)},r=[],n=a("1da1"),i=(a("b0c0"),a("96cf"),a("d49b")),o=a("d411"),l=a("bc3a"),c=a.n(l),d=a("3d20"),u=a.n(d),m={components:{FormModal:i["default"],DetailModal:o["default"]},data:function(){return{breadcrumbs:[{text:"Activities",disabled:!0,href:"breadcrumbs_dashboard"},{text:"Field Coordinator",disabled:!0,href:"breadcrumbs_link_1"}],localConfig:{programYear:""},modals:{form:{show:!1,data:null,key:29291},detail:{show:!1,data:null,key:89238292}},table:{headers:[{text:"No",value:"no",width:"70"},{text:"ID Karyawan",value:"nik"},{text:"Nama",value:"name"},{text:"No KTP",value:"ktp_no"},{text:"Posisi",value:"emp_position"},{text:"Unit Manager",value:"emp_position"},{text:"Actions",value:"actions",sortable:!1}],items:[],loading:{show:!1,text:"Loading..."},search:""},user:""}},mounted:function(){this.firstAccessPage()},methods:{errorResponse:function(t){console.log(t),t.response&&t.response.status&&401==t.response.status&&(localStorage.removeItem("token"),this.$router.push("/"))},firstAccessPage:function(){var t=this;return Object(n["a"])(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return t.user=t.$store.state.User,t.localConfig.programYear=t.$store.state.programYear.model,e.next=4,t.getTableData();case 4:case"end":return e.stop()}}),e)})))()},getStatusColumn:function(t,e){if("bg_color"==t){if("document_saving"==e)return"blue darken-1";if("ready_to_submit"==e)return"orange";if("submit_review"==e)return"green darken-1"}if("icon"==t){if("document_saving"==e)return"mdi-content-save";if("ready_to_submit"==e)return"mdi-content-save-check";if("submit_review"==e)return"mdi-check-circle"}if("text"==t){if("document_saving"==e)return"Disimpan";if("ready_to_submit"==e)return"Menunggu Verifikasi";if("submit_review"==e)return"Terverifikasi"}return""},getTableData:function(){var t=this;return Object(n["a"])(regeneratorRuntime.mark((function e(){var a,s;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.prev=0,t.table.loading.show=!0,a=t.$store.getters.getApiUrl("GetFieldCoordinator"),e.next=5,c.a.get(a,t.$store.state.apiConfig);case 5:s=e.sent,t.table.items=s.data.data.result,e.next=12;break;case 9:e.prev=9,e.t0=e["catch"](0),t.errorResponse(e.t0);case 12:return e.prev=12,t.table.loading.show=!1,e.finish(12);case 15:case"end":return e.stop()}}),e,null,[[0,9,12,15]])})))()},modalActions:function(t){"close"==t.type?(this.modals[t.name].show=!1,this.modals[t.name].data=null):"refresh-table"==t.type&&this.getTableData()},showModal:function(t,e){var a=this;return Object(n["a"])(regeneratorRuntime.mark((function s(){return regeneratorRuntime.wrap((function(s){while(1)switch(s.prev=s.next){case 0:return s.next=2,e.data_no;case 2:return a.modals[t].data=s.sent,s.next=5,!0;case 5:a.modals[t].show=s.sent;case 6:case"end":return s.stop()}}),s)})))()},swalActions:function(t){this.getTableData();var e=u.a.mixin({toast:!0,position:"top-end",showConfirmButton:!1,showCloseButton:!0,timer:1e4,timerProgressBar:!0,didOpen:function(t){t.addEventListener("mouseenter",u.a.stopTimer),t.addEventListener("mouseleave",u.a.resumeTimer)}});e.fire({icon:t.type,title:t.message})}}},f=m,b=a("2877"),v=a("6544"),h=a.n(v),p=a("2bc5"),g=a("8336"),_=a("b0af"),x=a("cc20"),w=a("8fea"),k=a("ce7e"),C=a("132d"),y=a("e449"),$=a("0fd9"),j=a("b974"),D=a("8654"),M=Object(b["a"])(f,s,r,!1,null,null,null);e["default"]=M.exports;h()(M,{VBreadcrumbs:p["a"],VBtn:g["a"],VCard:_["a"],VChip:x["a"],VDataTable:w["a"],VDivider:k["a"],VIcon:C["a"],VMenu:y["a"],VRow:$["a"],VSelect:j["a"],VTextField:D["a"]})},abd3:function(t,e,a){}}]);
//# sourceMappingURL=chunk-314dc074.ec7d85cf.js.map