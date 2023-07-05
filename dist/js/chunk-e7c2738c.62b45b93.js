(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-e7c2738c","chunk-2d0cb689"],{"4a17":function(e,t,a){"use strict";a.r(t);var r=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",[a("v-dialog",{attrs:{"max-width":"500","content-class":"rounded-xl",persistent:"",scrollable:""},model:{value:e.isShow,callback:function(t){e.isShow=t},expression:"isShow"}},[a("v-card",[a("v-card-title",{staticClass:"headermodalstyle"},[e._v(" Change FC "),a("v-divider",{staticClass:"mx-2",attrs:{color:"white"}}),a("v-icon",{attrs:{color:"red"},on:{click:function(t){e.isShow=!1}}},[e._v("mdi-close-circle")])],1),a("v-card-text",[a("v-overlay",{attrs:{absolute:"",value:e.isLoading}},[a("v-progress-circular",{attrs:{size:80,width:7,indeterminate:"",color:"white"}}),a("p",{staticClass:"mt-2 mb-0"},[e._v(e._s(e.isLoadingText))])],1),a("v-autocomplete",{staticClass:"mt-2",attrs:{color:"green","item-color":"green",rounded:"",outlined:"","menu-props":{bottom:!0,offsetY:!0,rounded:"xl",transition:"slide-y-transition"},"hide-details":"",label:"Unit Manager","item-text":"name","item-value":"nik",items:e.UM.items,loading:e.UM.loading,disabled:"IT"!=e.$store.state.User.role_group},on:{change:function(t){return e.getOptions("FC",t)}},scopedSlots:e._u([{key:"item",fn:function(t){return[a("v-list-item-content",[a("v-list-item-title",{domProps:{innerHTML:e._s(t.item.name)}}),a("v-list-item-subtitle",[e._v(e._s(t.item.nik))])],1)]}}]),model:{value:e.UM.model,callback:function(t){e.$set(e.UM,"model",t)},expression:"UM.model"}}),a("v-autocomplete",{staticClass:"mt-3",attrs:{color:"green","item-color":"green",rounded:"",outlined:"","menu-props":{bottom:!0,offsetY:!0,rounded:"xl",transition:"slide-y-transition"},"hide-details":"",label:"Field Facilitator","item-text":"name","item-value":"nik",items:e.FC.items,loading:e.FC.loading},scopedSlots:e._u([{key:"item",fn:function(t){return[a("v-list-item-content",[a("v-list-item-title",{domProps:{innerHTML:e._s(t.item.name)}}),a("v-list-item-subtitle",[e._v(e._s(t.item.nik))])],1)]}}]),model:{value:e.FC.model,callback:function(t){e.$set(e.FC,"model",t)},expression:"FC.model"}})],1),a("v-card-actions",[a("v-divider",{staticClass:"mr-2"}),a("v-btn",{staticClass:"px-5",attrs:{color:"green white--text",rounded:"",disabled:!e.FC.model||!e.ff_no},on:{click:e.save}},[a("v-icon",{staticClass:"mr-1"},[e._v("mdi-content-save-check")]),e._v(" Save")],1)],1)],1)],1)],1)},o=[],n=a("1da1"),s=(a("96cf"),a("a9e3"),a("bc3a")),i=a.n(s),l={props:{show:{type:Boolean,default:!1},id:{type:String|Number,default:""}},data:function(){return{isLoading:!1,isLoadingText:"Loading...",ff_no:"",UM:{items:[],loading:!1,model:""},FC:{items:[],loading:!1,model:""}}},computed:{isShow:{get:function(){return this.show},set:function(e){0==e&&this.resetData(),this.$emit("dialogAct",{name:"changeFF",status:e})}}},watch:{id:{handler:function(e){var t=this;return Object(n["a"])(regeneratorRuntime.mark((function a(){return regeneratorRuntime.wrap((function(a){while(1)switch(a.prev=a.next){case 0:if(!e){a.next=9;break}if(t.isLoading=!0,0!=t.UM.items.length){a.next=6;break}return t.isLoadingText="Get List UM data...",a.next=6,t.getOptions("UM");case 6:return a.next=8,t.getDetail(e);case 8:t.isLoading=!1;case 9:case"end":return a.stop()}}),a)})))()}}},methods:{getDetail:function(e){var t=this;return Object(n["a"])(regeneratorRuntime.mark((function a(){var r,o,n,s;return regeneratorRuntime.wrap((function(a){while(1)switch(a.prev=a.next){case 0:return a.prev=0,t.isLoadingText="Get FF data...",a.next=4,i.a.get(t.$store.getters.getApiUrl("GetFieldFacilitatorDetail?id=".concat(e)),t.$store.state.apiConfig);case 4:return r=a.sent,o=r.data.data.result,t.isLoadingText="Get FC data...",a.next=9,i.a.get(t.$store.getters.getApiUrl("GetEmployeeAll?name=".concat(o.fc_name,"&position=19")),t.$store.state.apiConfig);case 9:if(n=a.sent,s=n.data.data.result.data,!(s.length>0)){a.next=17;break}return t.ff_no=o.ff_no,t.UM.model=s[0].manager_code,a.next=16,t.getOptions("FC",t.UM.model);case 16:t.FC.model=o.fc_no;case 17:a.next=23;break;case 19:a.prev=19,a.t0=a["catch"](0),t.$emit("showSnackbar",{text:a.t0.message,color:"red"}),void 0!=a.t0.response?t.sessionEnd(a.t0):console.error(a.t0);case 23:return a.prev=23,t.isLoadingText="Loading...",a.finish(23);case 26:case"end":return a.stop()}}),a,null,[[0,19,23,26]])})))()},getOptions:function(e){var t=arguments,a=this;return Object(n["a"])(regeneratorRuntime.mark((function r(){var o,n,s,l;return regeneratorRuntime.wrap((function(r){while(1)switch(r.prev=r.next){case 0:return o=t.length>1&&void 0!==t[1]?t[1]:null,r.prev=1,a[e].loading=!0,a[e].model="",n="","UM"==e?n="GetEmployeeAll?position_no=20":"FC"==e&&(n="GetEmployeebyManager?position=19&manager_code=".concat(o)),r.next=8,i.a.get(a.$store.getters.getApiUrl(n),a.$store.state.apiConfig);case 8:return s=r.sent,l=s.data.data,r.next=12,l.result.data;case 12:a[e].items=r.sent,r.next=19;break;case 15:r.prev=15,r.t0=r["catch"](1),a.$emit("showSnackbar",{text:r.t0.message,color:"red"}),void 0!=r.t0.response?a.sessionEnd(r.t0):console.error(r.t0);case 19:return r.prev=19,a[e].loading=!1,r.finish(19);case 22:case"end":return r.stop()}}),r,null,[[1,15,19,22]])})))()},resetData:function(){this.ff_no="",this.FC.items=[],this.FC.model="",this.UM.items=[],this.UM.model=""},save:function(){var e=this;return Object(n["a"])(regeneratorRuntime.mark((function t(){var a;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.prev=0,e.isLoading=!0,e.isLoadingText="Changing FC...",t.next=5,i.a.post(e.$store.getters.getApiUrl("ChangeFCFieldFacilitator"),{ff_no:e.ff_no,fc_no:e.FC.model},e.$store.state.apiConfig);case 5:a=t.sent,console.log(a),e.$emit("refreshTable"),e.$emit("showSnackbar",{text:a.data,color:200==a.status?"green":"red"}),t.next=15;break;case 11:t.prev=11,t.t0=t["catch"](0),e.$emit("showSnackbar",{text:t.t0.message,color:"red"}),void 0!=t.t0.response?e.sessionEnd(t.t0):console.error(t.t0);case 15:return t.prev=15,e.isLoading=!1,e.isShow=!1,t.finish(15);case 19:case"end":return t.stop()}}),t,null,[[0,11,15,19]])})))()},sessionEnd:function(e){"undefined"!=typeof e.response.status&&401==e.response.status&&(localStorage.removeItem("token"),this.$router.push("/"))}}},c=l,d=a("2877"),u=a("6544"),m=a.n(u),v=a("c6a6"),h=a("8336"),g=a("b0af"),f=a("99d9"),p=a("169a"),b=a("ce7e"),k=a("132d"),_=a("5d23"),x=a("a797"),w=a("490a"),F=Object(d["a"])(c,r,o,!1,null,null,null);t["default"]=F.exports;m()(F,{VAutocomplete:v["a"],VBtn:h["a"],VCard:g["a"],VCardActions:f["a"],VCardText:f["c"],VCardTitle:f["d"],VDialog:p["a"],VDivider:b["a"],VIcon:k["a"],VListItemContent:_["a"],VListItemSubtitle:_["b"],VListItemTitle:_["c"],VOverlay:x["a"],VProgressCircular:w["a"]})},a722:function(e,t,a){"use strict";a("20f6");var r=a("e8f2");t["a"]=Object(r["a"])("layout")},efae:function(e,t,a){"use strict";a.r(t);var r=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",[a("v-breadcrumbs",{staticClass:"breadcrumbsmain",attrs:{"data-aos":"fade-right",dark:"dark"==e.$store.state.theme,items:e.itemsbr,divider:">",large:""}}),a("AddFFModal",{attrs:{show:e.dialogs.addEditFF.show,id:e.dialogs.addEditFF.id,programYear:e.localConfig.programYear},on:{dialogAct:function(t){return e.dialogsAction(t)},showSnackbar:function(t){return e.showSnackbar(t.text,t.color)},swal:function(t){return e.swalActions(t)},refreshTable:e.initialize}}),a("v-dialog",{attrs:{"max-width":"700px","content-class":"rounded-xl",scrollable:""},model:{value:e.dialogdetail,callback:function(t){e.dialogdetail=t},expression:"dialogdetail"}},[a("v-card",[a("v-card-title",{staticClass:"mb-1 headermodalstyle"},[a("span",{},[e._v("Detail FF")])]),a("v-card-text",[1==e.load?a("v-container",{staticStyle:{"background-color":"rgba(255, 255, 255, 0.5)"},attrs:{fluid:"","fill-height":""}},[a("v-layout",{attrs:{"justify-center":"","align-center":""}},[a("v-progress-circular",{attrs:{size:80,width:10,indeterminate:"",color:"primary"}})],1)],1):e._e(),0==e.load?a("v-container",[a("v-row",[a("v-col",{attrs:{cols:"12",sm:"12",md:"6"}},[a("div",[a("h5",[e._v("FF Number")]),a("h3",{staticClass:"ml-2"},[e._v(" "+e._s(e.defaultItem.ff_no)+" ")])])]),a("v-col",{attrs:{cols:"12",sm:"12",md:"6"}},[a("div",[a("h5",[e._v("No KTP")]),a("h3",{staticClass:"ml-2"},[e._v(e._s(e.defaultItem.ktp_no))])])]),a("v-col",{attrs:{cols:"12",sm:"12",md:"12"}},[a("div",[a("h5",[e._v("Nama FF")]),a("h3",{staticClass:"ml-2"},[e._v(e._s(e.defaultItem.name))])])]),a("v-col",{attrs:{cols:"12",sm:"12",md:"12"}},[a("div",[a("h5",[e._v("Alamat FF")]),a("h3",{staticClass:"ml-2"},[e._v(e._s(e.defaultItem.address))])])]),a("v-col",{attrs:{cols:"12",sm:"12",md:"4"}},[a("div",[a("h5",[e._v("Desa")]),a("h3",{staticClass:"ml-2"},[e._v(" "+e._s(e.defaultItem.village)+" ")])])]),a("v-col",{attrs:{cols:"12",sm:"12",md:"8"}},[a("div",[a("h5",[e._v("Kode Pos")]),a("h3",{staticClass:"ml-2"},[e._v(" "+e._s(e.defaultItem.post_code)+" ")])])]),a("v-col",{attrs:{cols:"12",sm:"12",md:"4"}},[a("div",[a("h5",[e._v("Kecamatan")]),a("h3",{staticClass:"ml-2"},[e._v(e._s(e.defaultItem.kecamatan))])])]),a("v-col",{attrs:{cols:"12",sm:"12",md:"4"}},[a("div",[a("h5",[e._v("Kabupaten/Kota")]),a("h3",{staticClass:"ml-2"},[e._v(e._s(e.defaultItem.city))])])]),a("v-col",{attrs:{cols:"12",sm:"12",md:"4"}},[a("div",[a("h5",[e._v("Provinsi")]),a("h3",{staticClass:"ml-2"},[e._v(e._s(e.defaultItem.province))])])]),a("v-col",{attrs:{cols:"12",sm:"12",md:"4"}},[a("div",[a("h5",[e._v("Working Area")]),a("h3",{staticClass:"ml-2"},[e._v(" "+e._s(e.defaultItem.namaWorkingArea)+" ")])])]),a("v-col",{attrs:{cols:"12",sm:"12",md:"4"}},[a("div",[a("h5",[e._v("Target Area")]),a("h3",{staticClass:"ml-2"},[e._v(e._s(e.defaultItem.namaTA))])])]),a("v-col",{attrs:{cols:"12",sm:"12",md:"4"}},[a("div",[a("h5",[e._v("Management Unit")]),a("h3",{staticClass:"ml-2"},[e._v(e._s(e.defaultItem.namaMU))])])]),a("v-col",{attrs:{cols:"12",sm:"12",md:"4"}},[a("div",[a("h5",[e._v("No Hp")]),a("h3",{staticClass:"ml-2"},[e._v(" "+e._s(e.defaultItem.phone)+" ")])])]),a("v-col",{attrs:{cols:"12",sm:"12",md:"4"}},[a("div",[a("h5",[e._v("Jenis Kelamin")]),a("h3",{staticClass:"ml-2"},[e._v(e._s(e.defaultItem.gender))])])]),a("v-col",{attrs:{cols:"12",sm:"12",md:"4"}},[a("div",[a("h5",[e._v("Agama")]),a("h3",{staticClass:"ml-2"},[e._v(e._s(e.defaultItem.religion))])])]),a("v-col",{attrs:{cols:"12",sm:"12",md:"6"}},[a("div",[a("h5",[e._v("Tanggal Lahir")]),a("h3",{staticClass:"ml-2"},[e._v(e._s(e.defaultItem.birthday))])])]),a("v-col",{attrs:{cols:"12",sm:"12",md:"6"}},[a("div",[a("h5",[e._v("Status Perkawinan")]),a("h3",{staticClass:"ml-2"},[e._v(e._s(e.defaultItem.marrital))])])]),a("v-col",{attrs:{cols:"12",sm:"12",md:"4"}},[a("div",[a("h5",[e._v("Akun Bank")]),a("h3",{staticClass:"ml-2"},[e._v(" "+e._s(e.defaultItem.bank_account)+" ")])])]),a("v-col",{attrs:{cols:"12",sm:"12",md:"4"}},[a("div",[a("h5",[e._v("Bank Branch")]),a("h3",{staticClass:"ml-2"},[e._v(e._s(e.defaultItem.bank_branch))])])]),a("v-col",{attrs:{cols:"12",sm:"12",md:"4"}},[a("div",[a("h5",[e._v("Bank Name")]),a("h3",{staticClass:"ml-2"},[e._v(e._s(e.defaultItem.bank_name))])])])],1)],1):e._e()],1),a("v-card-actions",[a("v-divider",{staticClass:"mx-2"}),1==e.defaultItem.active?a("v-btn",{staticClass:"px-5",attrs:{rounded:"",color:"red white--text"},on:{click:function(t){return e.nonactivateFF(e.defaultItem)}}},[a("v-icon",{staticClass:"mr-1"},[e._v("mdi-account-off")]),e._v(" Nonactivate ")],1):a("v-btn",{attrs:{dark:"",rounded:"",color:"green white--text"},on:{click:function(t){return e.activateFF(e.defaultItem)}}},[a("v-icon",{staticClass:"mr-1",attrs:{small:"",color:"white"}},[e._v(" mdi-account-check ")]),e._v(" Activate ")],1)],1)],1)],1),a("v-dialog",{attrs:{"max-width":"500px"},model:{value:e.dialogDelete,callback:function(t){e.dialogDelete=t},expression:"dialogDelete"}},[a("v-card",[a("v-card-title",{staticClass:"headline"},[e._v("Are you sure you want to delete this item?")]),a("v-card-actions",[a("v-spacer"),a("v-btn",{attrs:{color:"blue darken-1",text:""},on:{click:e.closeDelete}},[e._v("Cancel")]),a("v-btn",{attrs:{color:"blue darken-1",text:""},on:{click:e.deleteItemConfirm}},[e._v("OK")]),a("v-spacer")],1)],1)],1),a("v-dialog",{attrs:{"max-width":"500px",persistent:"","content-class":"rounded-lg",scrollable:""},model:{value:e.dialogs.nonactivateConfirmation.show,callback:function(t){e.$set(e.dialogs.nonactivateConfirmation,"show",t)},expression:"dialogs.nonactivateConfirmation.show"}},[e.dialogs.nonactivateConfirmation.model?a("v-card",{staticClass:"rounded-xl"},[a("v-card-title",{staticClass:"mb-1 headermodalstyle"},[a("v-icon",{staticClass:"mr-2 white--text"},[e._v("mdi-help-circle")]),a("span",[e._v("Confirmation")]),a("v-divider",{staticClass:"mx-2",attrs:{dark:""}}),a("v-icon",{attrs:{color:"red"},on:{click:function(t){e.dialogs.nonactivateConfirmation.show=!1}}},[e._v("mdi-close-circle")])],1),a("v-card-text",[a("h2",{staticClass:"text-center pt-4"},[e._v("Do u want to "+e._s(e.dialogs.nonactivateConfirmation.model[1]?"Activate":"Nonactivate")+" this FF?")]),a("v-row",{staticClass:"mt-10 align-center mb-0"},[a("v-divider",{staticClass:"mx-2"}),a("v-btn",{attrs:{rounded:"",color:"red white--text mr-1"},on:{click:function(t){e.dialogs.nonactivateConfirmation.show=!1}}},[a("v-icon",{staticClass:"mr-1"},[e._v("mdi-close-circle")]),e._v(" Close ")],1),a("v-btn",{attrs:{rounded:"",color:"green white--text ml-1"},on:{click:e.confirmNonactivate}},[a("v-icon",{staticClass:"mr-1"},[e._v("mdi-check-circle")]),e._v(" "+e._s(e.dialogs.nonactivateConfirmation.model[1]?"Activate":"Nonactivate")+" ")],1),a("v-divider",{staticClass:"mx-2"})],1)],1)],1):e._e()],1),a("ChangeFFModal",{attrs:{show:e.dialogs.changeFF.show,id:e.dialogs.changeFF.id},on:{dialogAct:function(t){return e.dialogsAction(t)},showSnackbar:function(t){return e.showSnackbar(t.text,t.color)},refreshTable:e.initialize}}),a("v-data-table",{staticClass:"rounded-xl elevation-6 mx-3 pa-1 mb-4",attrs:{"data-aos":"fade-up","data-aos-delay":"200","multi-sort":"",headers:e.headers,items:e.dataobject,search:e.search,loading:e.loadtable,"loading-text":"Loading... Please wait"},scopedSlots:e._u([{key:"top",fn:function(){return[a("v-toolbar",{attrs:{flat:"",rounded:"xl"}},[a("v-select",{staticClass:"mx-auto mr-lg-2 mb-2 mb-lg-0",staticStyle:{"max-width":"200px"},attrs:{color:"success","item-color":"success",items:["Semua"].concat(e.$store.state.programYear.options),disabled:e.loadtable,outlined:"",dense:"","hide-details":"","menu-props":{bottom:!0,offsetY:!0,rounded:"xl",transition:"slide-y-transition"},rounded:"",label:"Program Year"},model:{value:e.localConfig.programYear,callback:function(t){e.$set(e.localConfig,"programYear",t)},expression:"localConfig.programYear"}}),a("v-text-field",{attrs:{color:"green",outlined:"",rounded:"",dense:"","append-icon":"mdi-magnify",label:"Search","hide-details":""},model:{value:e.search,callback:function(t){e.search=t},expression:"search"}}),a("v-divider",{staticClass:"mx-4",attrs:{inset:""}}),1==e.RoleAccesCRUDShow?a("v-btn",{staticClass:"mb-2",attrs:{dark:"",rounded:"",color:"blue"},on:{click:function(t){return e.showAddModal()}}},[a("v-icon",{attrs:{small:""}},[e._v("mdi-plus")]),e._v(" Add Item ")],1):e._e()],1)]},proxy:!0},{key:"item.active",fn:function(t){var r=t.item;return[a("v-chip",{attrs:{color:(r.active?"green":"red")+" white--text"}},[e._v(" "+e._s(r.active?"Active":"Nonactive")+" ")])]}},{key:"item.actions",fn:function(t){var r=t.item;return[a("v-menu",{attrs:{rounded:"xl",bottom:"",left:"","offset-y":"",transition:"slide-y-transition","close-on-content-click":!0},scopedSlots:e._u([{key:"activator",fn:function(t){var r=t.on,o=t.attrs;return[a("v-icon",e._g(e._b({attrs:{color:"dark"}},"v-icon",o,!1),r),[e._v(" mdi-arrow-down-drop-circle ")])]}}],null,!0)},[a("v-card",{staticClass:"rounded-xl pa-2"},[a("v-btn",{staticClass:"mb-1",attrs:{dark:"",rounded:"",color:"info",block:"",small:""},on:{click:function(t){return e.showDetail(r)}}},[a("v-icon",{staticClass:"mr-1",attrs:{small:"",color:"white"},on:{click:function(t){return e.showDetail(r)}}},[e._v(" mdi-information-outline ")]),e._v(" Detail ")],1),1==e.RoleAccesCRUDShow&&1!=r.validation&&("UNIT MANAGER"==e.User.role_name||"REGIONAL MANAGER"==e.User.role_name)||"IT"==e.User.role_group?a("v-btn",{staticClass:"mb-1",attrs:{block:"",small:"",rounded:"",color:"warning white--text"},on:{click:function(t){return e.editItem(r)}}},[a("v-icon",{staticClass:"mr-1",attrs:{small:"",color:"white"}},[e._v(" mdi-pencil ")]),e._v(" Edit ")],1):e._e(),("IT"==e.User.role_group&&r.active,e._e())],1)],1)]}}])}),a("v-snackbar",{attrs:{color:e.colorsnackbar,timeout:e.timeoutsnackbar},model:{value:e.snackbar,callback:function(t){e.snackbar=t},expression:"snackbar"}},[e._v(" "+e._s(e.textsnackbar)+" ")])],1)},o=[],n=a("1da1"),s=(a("96cf"),a("b0c0"),a("d3b7"),a("25f0"),a("bc3a")),i=a.n(s),l=a("3d20"),c=a.n(l),d=a("4a17"),u=a("ec56"),m={name:"FieldFacilitator",components:{ChangeFFModal:d["default"],AddFFModal:u["default"]},data:function(){return{dialogs:{addEditFF:{show:!1,id:""},changeFF:{show:!1,id:""},nonactivateConfirmation:{show:!1,model:null}},menu2:"",valid:!0,datepicker:(new Date).toISOString().substr(0,10),itemsbr:[{text:"Employee",disabled:!0,href:"breadcrumbs_dashboard"},{text:"Field Facilitator",disabled:!0,href:"breadcrumbs_link_1"}],formTitle:"Add Item",value:"add",dialogdetail:!1,dialog:!1,dialogDelete:!1,loadtable:!1,load:!1,search:"",authtoken:"",BaseUrlGet:"",rules:[function(e){return!!e||"Required."},function(e){return e&&e.length>=1||"Min 1 characters"}],headers:[{text:"FF No",value:"ff_no"},{text:"FF Name",value:"namaFF"},{text:"FC Name",value:"namaFC"},{text:"MU",value:"mu_name"},{text:"TA",value:"ta_name"},{text:"Village",value:"village_name"},{text:"Status",value:"active",align:"center"},{text:"Actions",value:"actions",sortable:!1,align:"right"}],dataobject:[],defaultItem:{id:"",address:"",bank_account:"",bank_branch:"",bank_name:"",birthday:"",city:"",fc_no:"",ff_no:"",ff_photo:"",ff_photo_path:"",gender:"",join_date:"",kecamatan:"",ktp_no:"",marrital:"",mu_no:"",namaMU:"",namaTA:"",namaWorkingArea:"",name:"",phone:"",post_code:"",province:"",religion:"",target_area:"",user_id:"",village:"",working_area:"",active:""},itemsgender:[{text:"Laki-Laki",value:"male"},{text:"Perempuan",value:"female"}],itemsagama:[{text:"Islam",value:"islam"},{text:"Kristen",value:"kristen"},{text:"Khatolik",value:"khatolik"},{text:"Hindu",value:"hindu"},{text:"Budha",value:"budha"}],itemsmarrital:[{text:"Kawin",value:"kawin"},{text:"Belum Kawin",value:"belum kawin"},{text:"Janda",value:"janda"},{text:"Duda",value:"duda"}],itemsMU:[],itemsTA:[],itemsVillage:[],itemsTAForm:[],itemsVillageForm:[],valueMUForm:"",valueTAForm:"",valueVillageForm:"",valueFFcode:"",selectMUForm:"",selectTAForm:"",selectVillageForm:"",snackbar:!1,textsnackbar:"Test",timeoutsnackbar:5e3,colorsnackbar:null,user_id:"",itemsfc:[],User:[],um_code:"",fc_no_selected:"",RoleAccesFilterShow:!0,RoleAccesCRUDShow:!0,RoleAccesCRUDDelete:!0,localConfig:{programYear:""}}},mounted:function(){this.firstAccessPage()},watch:{"localConfig.programYear":{handler:function(e){this.initialize()}}},methods:{dialogsAction:function(e){this.dialogs[e.name].show=e.status,"changeFF"==e.name&&0==e.status&&(this.dialogs[e.name].id="")},firstAccessPage:function(){this.authtoken=localStorage.getItem("token"),this.User=JSON.parse(localStorage.getItem("User")),this.user_id=this.User.employee_no,this.fc_no_selected=this.User.fc.fc,this.typegetdata=this.User.fc.value_data,this.BaseUrlGet=localStorage.getItem("BaseUrlGet"),this.localConfig.programYear=this.$store.state.programYear.model,this.checkRoleAccess(),this.initialize(),this.getMU()},checkRoleAccess:function(){"IT"==this.User.role_group?(this.RoleAccesCRUDShow=!0,this.RoleAccesFilterShow=!0,this.RoleAccesCRUDDelete=!0,this.getFCAll()):"20"==this.User.role?(this.um_code=this.User.um.um,this.RoleAccesCRUDShow=!0,this.RoleAccesFilterShow=!1,this.RoleAccesCRUDDelete=!1,this.getEmpFCbyManager()):(this.RoleAccesCRUDShow=!1,this.RoleAccesFilterShow=!0,this.RoleAccesCRUDDelete=!1)},initialize:function(){var e=this;return Object(n["a"])(regeneratorRuntime.mark((function t(){var a;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return e.loadtable=!0,t.prev=1,t.next=4,i.a.get(e.BaseUrlGet+"GetFieldFacilitatorAllWeb?fc_no="+e.fc_no_selected+"&program_year=".concat(e.localConfig.programYear),{headers:{Authorization:"Bearer "+e.authtoken}});case 4:a=t.sent,0!=a.data.length?(e.dataobject=a.data.data.result.data,e.loadtable=!1):(console.log("Kosong"),e.loadtable=!1),t.next=12;break;case 8:t.prev=8,t.t0=t["catch"](1),console.error(t.t0),401==t.t0.response.status?(e.loadtable=!1,localStorage.removeItem("token"),e.$router.push("/")):(e.dataobject=[],e.loadtable=!1);case 12:case"end":return t.stop()}}),t,null,[[1,8]])})))()},getDetail:function(e,t){var a=this;return Object(n["a"])(regeneratorRuntime.mark((function r(){var o;return regeneratorRuntime.wrap((function(r){while(1)switch(r.prev=r.next){case 0:return a.load=!0,r.prev=1,r.next=4,i.a.get(a.BaseUrlGet+"GetFieldFacilitatorDetail?id="+e.id,{headers:{Authorization:"Bearer "+a.authtoken}});case 4:o=r.sent,console.log(o.data.data.result),0!=o.data.length?("detail"==t?a.load=!1:(a.valueMUForm=o.data.data.result.mu_no,a.valueTAForm=o.data.data.result.target_area),a.defaultItem=Object.assign({},o.data.data.result),a.datepicker=o.data.data.result.birthday,a.load=!1):(console.log("Kosong"),a.load=!1),r.next=13;break;case 9:r.prev=9,r.t0=r["catch"](1),console.error(r.t0),401==r.t0.response.status?(localStorage.removeItem("token"),a.$router.push("/"),a.load=!1):a.load=!1;case 13:case"end":return r.stop()}}),r,null,[[1,9]])})))()},getEmpFCbyManager:function(){var e=this;return Object(n["a"])(regeneratorRuntime.mark((function t(){var a;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,i.a.get(e.BaseUrlGet+"GetEmployeebyManager?manager_code="+e.um_code+"&position=19",{headers:{Authorization:"Bearer "+e.authtoken}});case 3:a=t.sent,console.log(a.data.data.result),0!=a.data.length?e.itemsfc=a.data.data.result.data:console.log("Kosong"),t.next=12;break;case 8:t.prev=8,t.t0=t["catch"](0),console.error(t.t0.response),401==t.t0.response.status&&(localStorage.removeItem("token"),e.$router.push("/"));case 12:case"end":return t.stop()}}),t,null,[[0,8]])})))()},getFCAll:function(){var e=this;return Object(n["a"])(regeneratorRuntime.mark((function t(){var a;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,i.a.get(e.BaseUrlGet+"GetEmployeebyPosition?position_code=19",{headers:{Authorization:"Bearer "+e.authtoken}});case 3:a=t.sent,0!=a.data.length?e.itemsfc=a.data.data.result.data:console.log("Kosong"),t.next=11;break;case 7:t.prev=7,t.t0=t["catch"](0),console.error(t.t0.response),401==t.t0.response.status&&(localStorage.removeItem("token"),e.$router.push("/"));case 11:case"end":return t.stop()}}),t,null,[[0,7]])})))()},getMU:function(){var e=this;return Object(n["a"])(regeneratorRuntime.mark((function t(){var a;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,i.a.get(e.BaseUrlGet+"GetManagementUnit",{headers:{Authorization:"Bearer "+e.authtoken}});case 3:a=t.sent,0!=a.data.length?e.itemsMU=a.data.data.result:console.log("Kosong"),t.next=11;break;case 7:t.prev=7,t.t0=t["catch"](0),console.error(t.t0.response),401==t.t0.response.status&&(localStorage.removeItem("token"),e.$router.push("/"));case 11:case"end":return t.stop()}}),t,null,[[0,7]])})))()},getTA:function(e){var t=this;return Object(n["a"])(regeneratorRuntime.mark((function a(){var r,o;return regeneratorRuntime.wrap((function(a){while(1)switch(a.prev=a.next){case 0:return r="",r="table"==e?t.valueMU:t.valueMUForm,a.prev=2,a.next=5,i.a.get(t.BaseUrlGet+"GetTargetArea?mu_no="+r,{headers:{Authorization:"Bearer "+t.authtoken}});case 5:o=a.sent,0!=o.data.length?"table"==e?t.itemsTA=o.data.data.result:t.itemsTAForm=o.data.data.result:console.log("Kosong"),a.next=13;break;case 9:a.prev=9,a.t0=a["catch"](2),console.error(a.t0.response),401==a.t0.response.status&&(localStorage.removeItem("token"),t.$router.push("/"));case 13:case"end":return a.stop()}}),a,null,[[2,9]])})))()},getVillage:function(e){var t=this;return Object(n["a"])(regeneratorRuntime.mark((function a(){var r,o;return regeneratorRuntime.wrap((function(a){while(1)switch(a.prev=a.next){case 0:return r="",r="table"==e?t.valueTA:t.valueTAForm,a.prev=2,a.next=5,i.a.get(t.BaseUrlGet+"GetDesa?kode_ta="+r,{headers:{Authorization:"Bearer "+t.authtoken}});case 5:o=a.sent,0!=o.data.length?"table"==e?t.itemsVillage=o.data.data.result:t.itemsVillageForm=o.data.data.result:console.log("Kosong"),a.next=13;break;case 9:a.prev=9,a.t0=a["catch"](2),console.error(a.t0.response),401==a.t0.response.status&&(localStorage.removeItem("token"),t.$router.push("/"));case 13:case"end":return a.stop()}}),a,null,[[2,9]])})))()},addData:function(){var e=this;return Object(n["a"])(regeneratorRuntime.mark((function t(){var a,r;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return a={fc_no:e.defaultItem.fc_no,name:e.defaultItem.name,birthday:e.datepicker,religion:e.defaultItem.religion,gender:e.defaultItem.gender,ktp_no:e.defaultItem.ktp_no,address:e.defaultItem.address,village:e.defaultItem.village,kecamatan:e.defaultItem.kecamatan,city:e.defaultItem.city,province:e.defaultItem.province,working_area:e.defaultItem.working_area,mu_no:e.defaultItem.mu_no,target_area:e.defaultItem.target_area,active:1,marrital:e.defaultItem.marrital,join_date:"1999-01-01",phone:e.defaultItem.phone,post_code:e.defaultItem.post_code,bank_account:e.defaultItem.bank_account,bank_branch:e.defaultItem.bank_branch,bank_name:e.defaultItem.bank_name,user_id:e.user_id},t.prev=1,t.next=4,i.a.post(e.BaseUrlGet+"AddFieldFacilitator",a,{headers:{Authorization:"Bearer "+e.authtoken}});case 4:r=t.sent,console.log(r.data.data.result),"success"==r.data.data.result?(e.dialog=!1,e.snackbar=!0,e.colorsnackbar="green",e.textsnackbar="Sukses mengubah data",e.initialize()):(e.dialog=!0,e.snackbar=!0,e.colorsnackbar="red",e.textsnackbar="Gagal mengubah data"),t.next=13;break;case 9:t.prev=9,t.t0=t["catch"](1),console.error(t.t0.response),401==t.t0.response.status?(e.dialog=!0,e.snackbar=!0,e.colorsnackbar="red",e.textsnackbar="Gagal mengubah data",localStorage.removeItem("token"),e.$router.push("/")):(e.dialog=!0,e.snackbar=!0,e.colorsnackbar="red",e.textsnackbar="Gagal mengubah data");case 13:case"end":return t.stop()}}),t,null,[[1,9]])})))()},updateData:function(){var e=this;return Object(n["a"])(regeneratorRuntime.mark((function t(){var a,r;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return a={id:e.defaultItem.id,fc_no:e.defaultItem.fc_no,name:e.defaultItem.name,birthday:e.datepicker,religion:e.defaultItem.religion,gender:e.defaultItem.gender,ktp_no:e.defaultItem.ktp_no,address:e.defaultItem.address,village:e.defaultItem.village,kecamatan:e.defaultItem.kecamatan,city:e.defaultItem.city,province:e.defaultItem.province,working_area:e.defaultItem.working_area,mu_no:e.defaultItem.mu_no,target_area:e.defaultItem.target_area,active:1,marrital:e.defaultItem.marrital,join_date:"1999-01-01",phone:e.defaultItem.phone,post_code:e.defaultItem.post_code,bank_account:e.defaultItem.bank_account,bank_branch:e.defaultItem.bank_branch,bank_name:e.defaultItem.bank_name,user_id:e.user_id},console.log(a),t.prev=2,t.next=5,i.a.post(e.BaseUrlGet+"UpdateFieldFacilitator",a,{headers:{Authorization:"Bearer "+e.authtoken}});case 5:r=t.sent,console.log(r.data.data.result),"success"==r.data.data.result?(e.dialog=!1,e.snackbar=!0,e.colorsnackbar="green",e.textsnackbar="Sukses mengubah data",e.initialize()):(e.dialog=!0,e.snackbar=!0,e.colorsnackbar="red",e.textsnackbar="Gagal mengubah data"),t.next=14;break;case 10:t.prev=10,t.t0=t["catch"](2),console.error(t.t0.response),401==t.t0.response.status?(e.dialog=!0,e.snackbar=!0,e.colorsnackbar="red",e.textsnackbar="Gagal mengubah data",localStorage.removeItem("token"),e.$router.push("/")):(e.dialog=!0,e.snackbar=!0,e.colorsnackbar="red",e.textsnackbar="Gagal mengubah data");case 14:case"end":return t.stop()}}),t,null,[[2,10]])})))()},deleteData:function(){var e=this;return Object(n["a"])(regeneratorRuntime.mark((function t(){var a,r;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return a={id:e.defaultItem.id,user_id:e.user_id},console.log(a),t.prev=2,t.next=5,i.a.post(e.BaseUrlGet+"DeleteFieldFacilitator",a,{headers:{Authorization:"Bearer "+e.authtoken}});case 5:r=t.sent,console.log(r.data.data.result),"success"==r.data.data.result?(e.dialog=!1,e.snackbar=!0,e.colorsnackbar="green",e.textsnackbar="Sukses mengubah data",e.initialize()):(e.dialog=!0,e.snackbar=!0,e.colorsnackbar="red",e.textsnackbar="Gagal mengubah data"),t.next=14;break;case 10:t.prev=10,t.t0=t["catch"](2),console.error(t.t0.response),401==t.t0.response.status?(e.dialog=!0,e.snackbar=!0,e.colorsnackbar="red",e.textsnackbar="Gagal mengubah data",localStorage.removeItem("token"),e.$router.push("/")):(e.dialog=!0,e.snackbar=!0,e.colorsnackbar="red",e.textsnackbar="Gagal mengubah data");case 14:case"end":return t.stop()}}),t,null,[[2,10]])})))()},selectedMUForm:function(e){console.log(e),this.valueMUForm=e,null!=e?(this.getTA("form"),this.valueTAForm="",this.selectTAForm="",this.selectVillageForm="",this.valueVillageForm=""):(this.valueMUForm="",this.valueTAForm="",this.itemsTAForm=[],this.valueVillageForm="",this.itemsVillageForm=[],this.defaultItem.mu_no=e)},selectedTAForm:function(e){console.log(e),this.valueTAForm=e,null!=e?(this.getVillage("form"),this.valueVillageForm="",this.selectVillageForm="",this.defaultItem.working_area=""):(this.valueTAForm="",this.valueVillageForm="",this.itemsVillageForm=[],this.defaultItem.working_area="",this.defaultItem.target_area=e)},selectedVillageForm:function(e){console.log(e),this.valueVillageForm=e,this.defaultItem.working_area=e,null==e&&(this.valueVillageForm="",this.defaultItem.working_area="")},showDetail:function(e){this.type="Detail",console.log(e),this.dialogdetail=!0,this.getDetail(e,"detail")},showAddModal:function(){this.dialogs.addEditFF.id="",this.dialogs.addEditFF.show=!0},editItem:function(e){var t=this;return Object(n["a"])(regeneratorRuntime.mark((function a(){return regeneratorRuntime.wrap((function(a){while(1)switch(a.prev=a.next){case 0:t.dialogs.addEditFF.id=e.id.toString(),t.dialogs.addEditFF.show=!0;case 2:case"end":return a.stop()}}),a)})))()},deleteItem:function(e){console.log(e.id),this.defaultItem.id=e.id,this.dialogDelete=!0},deleteItemConfirm:function(){this.deleteData()},close:function(){this.dialog=!1},closeDelete:function(){this.dialogDelete=!1},nonactivateFF:function(e){this.dialogs.nonactivateConfirmation.show=!0,this.dialogs.nonactivateConfirmation.model=[e.ff_no,0]},activateFF:function(e){this.dialogs.nonactivateConfirmation.show=!0,this.dialogs.nonactivateConfirmation.model=[e.ff_no,1]},confirmNonactivate:function(){var e=this;return Object(n["a"])(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return e.dialogs.nonactivateConfirmation.show=!1,e.dialogdetail=!1,e.$store.state.loadingOverlayText="Nonactivate Field Facilitator...",e.$store.state.loadingOverlay=!0,t.next=6,i.a.post("".concat(e.BaseUrlGet,"NonactivateFieldFacilitator"),{ff_no:e.dialogs.nonactivateConfirmation.model[0],active:e.dialogs.nonactivateConfirmation.model[1]},{headers:{Authorization:"Bearer ".concat(e.authtoken)}}).then((function(){e.colorsnackbar="green",e.textsnackbar="".concat(e.dialogs.nonactivateConfirmation.model[1]?"Activate":"Nonactivate"," FF success!"),e.initialize()})).catch((function(t){e.colorsnackbar="red",e.textsnackbar="".concat(e.dialogs.nonactivateConfirmation.model[1]?"Activate":"Nonactivate"," FF failed!"),401==t.response.status&&(localStorage.removeItem("token"),e.$router.push("/"))})).finally((function(){e.snackbar=!0,e.timeoutsnackbar=5e3,e.$store.state.loadingOverlay=!1,e.$store.state.loadingOverlayText=null}));case 6:case"end":return t.stop()}}),t)})))()},showSnackbar:function(e,t){this.textsnackbar=e,this.colorsnackbar=t,this.snackbar=!0},swalActions:function(e){this.initialize();var t=c.a.mixin({toast:!0,position:"top-end",showConfirmButton:!1,showCloseButton:!0,timer:1e4,timerProgressBar:!0,didOpen:function(e){e.addEventListener("mouseenter",c.a.stopTimer),e.addEventListener("mouseleave",c.a.resumeTimer)}});t.fire({icon:e.type,title:e.message})}}},v=m,h=a("2877"),g=a("6544"),f=a.n(g),p=a("2bc5"),b=a("8336"),k=a("b0af"),_=a("99d9"),x=a("cc20"),w=a("62ad"),F=a("a523"),C=a("8fea"),I=a("169a"),A=a("ce7e"),U=a("132d"),y=a("a722"),R=a("e449"),S=a("490a"),T=a("0fd9"),V=a("b974"),D=a("2db4"),M=a("2fa4"),G=a("8654"),$=a("71d9"),B=Object(h["a"])(v,r,o,!1,null,null,null);t["default"]=B.exports;f()(B,{VBreadcrumbs:p["a"],VBtn:b["a"],VCard:k["a"],VCardActions:_["a"],VCardText:_["c"],VCardTitle:_["d"],VChip:x["a"],VCol:w["a"],VContainer:F["a"],VDataTable:C["a"],VDialog:I["a"],VDivider:A["a"],VIcon:U["a"],VLayout:y["a"],VMenu:R["a"],VProgressCircular:S["a"],VRow:T["a"],VSelect:V["a"],VSnackbar:D["a"],VSpacer:M["a"],VTextField:G["a"],VToolbar:$["a"]})}}]);
//# sourceMappingURL=chunk-e7c2738c.62b45b93.js.map