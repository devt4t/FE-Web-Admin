(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d225625"],{e3bc:function(e,t,a){"use strict";a.r(t);var n=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",[a("v-breadcrumbs",{staticClass:"breadcrumbsmain",attrs:{"data-aos":"fade-right",dark:"dark"==e.$store.state.theme,items:e.itemsbr,divider:">",large:""}}),a("v-data-table",{staticClass:"rounded-xl elevation-6 mx-3 pa-1",attrs:{"data-aos":"fade-up","data-aos-delay":"200",headers:e.headers,items:e.dataobject,search:e.search,loading:e.loadtable,"loading-text":"Loading... Please wait"},on:{"update:page":function(t){return e.page=t},"update:items-per-page":function(t){return e.itemsPerPage=t}},scopedSlots:e._u([{key:"top",fn:function(){return[a("v-toolbar",{staticClass:"rounded-xl",attrs:{flat:""}},[a("v-text-field",{staticStyle:{"max-width":"350px"},attrs:{"append-icon":"mdi-magnify",label:"Search",placeholder:"Search...","hide-details":"",dense:"",rounded:"",outlined:"",color:"green"},model:{value:e.search,callback:function(t){e.search=t},expression:"search"}}),a("v-divider",{staticClass:"ml-2"}),a("v-dialog",{attrs:{"max-width":"600px","content-class":"rounded-xl",scrollable:""},model:{value:e.dialog,callback:function(t){e.dialog=t},expression:"dialog"}},[a("v-card",[a("v-card-title",{staticClass:"mb-1 headermodalstyle"},[a("span",{staticClass:"headline"},[e._v("Edit Item")])]),a("v-card-text",[a("v-container",[a("v-row",[a("v-col",{attrs:{cols:"12",sm:"4",md:"4"}},[a("div",[a("h5",[e._v("ID Karyawan")]),a("h2",{staticClass:"ml-2"},[e._v(e._s(e.defaultItem.IdEmp))])])]),a("v-col",{attrs:{cols:"12",sm:"8",md:"8"}},[a("div",[a("h5",[e._v("Nama")]),a("h2",{staticClass:"ml-2"},[e._v(e._s(e.defaultItem.NamaEmp))])])])],1),a("v-row",{staticClass:"mt-5"},[a("v-col",{attrs:{cols:"12",sm:"12",md:"12"}},[a("v-autocomplete",{attrs:{rounded:"",color:"green","item-color":"success","menu-props":{rounded:"xl",transition:"slide-y-transition"},outlined:"","hide-details":"",dense:"",items:e.itemsEmp,"item-value":"nik","item-text":"name",label:"Pilih Manager",clearable:""},on:{change:function(t){return e.selectedManager(t)}},model:{value:e.defaultItem.IdManager,callback:function(t){e.$set(e.defaultItem,"IdManager",t)},expression:"defaultItem.IdManager"}})],1),a("v-col",{attrs:{cols:"12",sm:"12",md:"12"}},[a("v-autocomplete",{attrs:{rounded:"",color:"green","item-color":"success","menu-props":{rounded:"xl",transition:"slide-y-transition"},outlined:"","hide-details":"",dense:"",items:e.itemsMenu,"item-value":"id","item-text":"name",label:"Pilih Tambah Menu Access"},on:{change:function(t){return e.selectedMenuAccess(t)}},model:{value:e.menudropdown,callback:function(t){e.menudropdown=t},expression:"menudropdown"}})],1)],1),a("v-row",[a("v-col",{attrs:{cols:"12",sm:"12",md:"12"}},[a("v-data-table",{staticClass:"elevation-1 rounded-xl",attrs:{headers:e.headersmenu,items:e.defaultItem.MenuTable,"append-icon":"mdi-magnify","items-per-page":5},scopedSlots:e._u([{key:"item.actions",fn:function(t){var n=t.item;return[a("v-icon",{attrs:{color:"red"},on:{click:function(t){return e.deletelistmenu(n)}}},[e._v(" mdi-delete ")])]}}])})],1)],1)],1)],1),a("v-card-actions",[a("v-spacer"),a("v-btn",{attrs:{color:"red",text:"",rounded:""},on:{click:e.close}},[a("v-icon",{staticClass:"mr-1"},[e._v("mdi-close-circle")]),e._v(" Cancel ")],1),a("v-btn",{attrs:{color:"green white--text",rounded:""},on:{click:e.save}},[a("v-icon",{staticClass:"mr-1"},[e._v("mdi-content-save")]),e._v(" Save ")],1)],1)],1)],1)],1)]},proxy:!0},{key:"item.no",fn:function(t){var a=t.index;return[e._v(" "+e._s(e.itemsPerPage*(e.page-1)+a+1)+" ")]}},{key:"item.Menu",fn:function(t){var n=t.item;return[n.Menu.split(", ").length==e.itemsMenu.length?a("v-chip",{staticClass:"pl-2",attrs:{color:"green white--text",rounded:""}},[a("v-icon",{staticClass:"mr-1"},[e._v("mdi-shield-crown")]),e._v(" All Access")],1):n.Menu?n.Menu.split(", ").length<=3?a("div",e._l(n.Menu.split(", "),(function(t,n){return a("v-chip",{key:t+n,staticClass:"pl-1 mr-1",attrs:{color:"green white--text"}},[a("v-icon",{staticClass:"mr-1"},[e._v("mdi-numeric-"+e._s(n+1)+"-circle")]),e._v(" "+e._s(t))],1)})),1):a("div",[a("v-menu",{attrs:{"content-class":"rounded-xl","max-height":"400","offset-y":""},scopedSlots:e._u([{key:"activator",fn:function(t){var s=t.on,r=t.attrs;return[a("v-chip",e._g(e._b({attrs:{color:"green white--text"}},"v-chip",r,!1),s),[a("v-icon",{staticClass:"mr-1"},[e._v("mdi-format-list-numbered")]),e._v(" "+e._s(n.Menu.split(", ").length)+" Access "),a("v-icon",[e._v("mdi-chevron-down")])],1)]}}],null,!0)},[a("v-card",{attrs:{scrollable:""}},[a("v-card-text",[a("v-simple-table",e._l(n.Menu.split(", ").sort(),(function(t,n){return a("tr",{key:n},[a("td",{staticClass:"text-center"},[e._v(e._s(n+1)+".")]),a("td",[e._v(e._s(t))])])})),0)],1)],1)],1)],1):a("v-chip",{staticClass:"pl-1",attrs:{color:"red white--text",rounded:""}},[a("v-icon",{staticClass:"mr-1"},[e._v("mdi-close-circle")]),e._v(" No Access")],1)]}},{key:"item.actions",fn:function(t){var n=t.item;return[a("v-icon",{staticClass:"mr-2",attrs:{color:"warning"},on:{click:function(t){return e.editItem(n)}}},[e._v(" mdi-pencil ")])]}}])}),a("v-snackbar",{attrs:{color:e.colorsnackbar,timeout:e.timeoutsnackbar},model:{value:e.snackbar,callback:function(t){e.snackbar=t},expression:"snackbar"}},[e._v(" "+e._s(e.textsnackbar)+" ")])],1)},s=[],r=a("1da1"),o=(a("b0c0"),a("a434"),a("96cf"),a("bc3a")),l=a.n(o),i={name:"Employee",data:function(){return{page:1,itemsPerPage:10,itemsbr:[{text:"Employee",disabled:!0,href:"breadcrumbs_dashboard"},{text:"Employee Menu",disabled:!0,href:"breadcrumbs_link_1"}],value:"add",dialog:!1,loadtable:!1,search:"",authtoken:"",BaseUrlGet:"",headers:[{text:"No",value:"no",width:"70"},{text:"Nama Emp",value:"NamaEmp",width:"20%"},{text:"Nama Manager",value:"NamaManager",width:"20%"},{text:"Menu Access",value:"Menu"},{text:"Actions",value:"actions",sortable:!1,align:"right"}],headersmenu:[{text:"Menu Code",value:"MenuCode"},{text:"Nama Menu",value:"MenuName"},{text:"Actions",value:"actions",sortable:!1,align:"right"}],defaultItem:{IdEmp:"",NamaEmp:"",Menu:"",IdManager:"",NamaManager:"",MenuCode:[],MenuTable:[]},dataobject:[],itemsEmp:[],itemsMenu:[],statusAdd:!0,snackbar:!1,textsnackbar:"Test",timeoutsnackbar:2e3,colorsnackbar:null,menudropdown:"",editedIndex:-1,editedItem:{MenuCode:"",MenuName:""}}},created:function(){this.authtoken=localStorage.getItem("token"),this.User=JSON.parse(localStorage.getItem("User")),this.BaseUrlGet=localStorage.getItem("BaseUrlGet"),this.BaseUrl=localStorage.getItem("BaseUrl"),this.initialize(),this.GetEmp(),this.GetMenu()},methods:{initialize:function(){var e=this;return Object(r["a"])(regeneratorRuntime.mark((function t(){var a;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return e.loadtable=!0,t.prev=1,t.next=4,l.a.get(e.BaseUrlGet+"GetEmployeeMenuAccess",{headers:{Authorization:"Bearer "+e.authtoken}});case 4:a=t.sent,0!=a.data.length?(e.dataobject=a.data.data.result.data,e.loadtable=!1):(e.dataobject=[],e.loadtable=!1),t.next=12;break;case 8:t.prev=8,t.t0=t["catch"](1),console.error(t.t0),401==t.t0.response.status?(e.loadtable=!1,localStorage.removeItem("token"),e.$router.push("/")):(e.dataobject=[],e.loadtable=!1);case 12:case"end":return t.stop()}}),t,null,[[1,8]])})))()},GetEmp:function(){var e=this;return Object(r["a"])(regeneratorRuntime.mark((function t(){var a;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,l.a.get(e.BaseUrlGet+"GetEmployeeAll",{headers:{Authorization:"Bearer "+e.authtoken}});case 3:a=t.sent,console.log(a.data.data.result.data),0!=a.data.length?e.itemsEmp=a.data.data.result.data.sort((function(e,t){return e.name.localeCompare(t.name)})):(console.log("Kosong"),e.itemsEmp=[]),t.next=12;break;case 8:t.prev=8,t.t0=t["catch"](0),console.error(t.t0),401==t.t0.response.status?(e.alerttoken=!0,localStorage.removeItem("token"),e.$router.push("/")):e.itemsEmp=[];case 12:case"end":return t.stop()}}),t,null,[[0,8]])})))()},GetMenu:function(){var e=this;return Object(r["a"])(regeneratorRuntime.mark((function t(){var a;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,l.a.get(e.BaseUrlGet+"GetAllMenuAccess",{headers:{Authorization:"Bearer "+e.authtoken}});case 3:a=t.sent,console.log(a.data.data.result),0!=a.data.length?e.itemsMenu=a.data.data.result.sort((function(e,t){return e.name.localeCompare(t.name)})):(console.log("Kosong"),e.itemsEmp=[]),t.next=12;break;case 8:t.prev=8,t.t0=t["catch"](0),console.error(t.t0),401==t.t0.response.status?(e.alerttoken=!0,localStorage.removeItem("token"),e.$router.push("/")):e.itemsEmp=[];case 12:case"end":return t.stop()}}),t,null,[[0,8]])})))()},Update:function(e){var t=this;return Object(r["a"])(regeneratorRuntime.mark((function a(){var n;return regeneratorRuntime.wrap((function(a){while(1)switch(a.prev=a.next){case 0:return console.log(e),a.prev=1,a.next=4,l.a.post(t.BaseUrlGet+"EditMenuAccessEmp",e,{headers:{Authorization:"Bearer "+t.authtoken}});case 4:n=a.sent,console.log(n.data.data.result),"success"==n.data.data.result?(t.dialog=!1,t.snackbar=!0,t.colorsnackbar="green",t.textsnackbar="Sukses mengubah data",t.initialize()):(t.dialog=!0,t.snackbar=!0,t.colorsnackbar="red",t.textsnackbar="Gagal mengubah data"),a.next=13;break;case 9:a.prev=9,a.t0=a["catch"](1),console.error(a.t0.response),401==a.t0.response.status?(t.dialog=!0,t.snackbar=!0,t.colorsnackbar="red",t.textsnackbar="Gagal mengubah data",localStorage.removeItem("token"),t.$router.push("/")):(t.dialog=!0,t.snackbar=!0,t.colorsnackbar="red",t.textsnackbar="Gagal mengubah data");case 13:return a.prev=13,t.menudropdown="",a.finish(13);case 16:case"end":return a.stop()}}),a,null,[[1,9,13,16]])})))()},editItem:function(e){console.log(e),this.defaultItem.IdEmp=e.IdEmp,this.defaultItem.NamaEmp=e.NamaEmp,this.defaultItem.Menu=e.Menu,this.defaultItem.IdManager=e.IdManager,this.defaultItem.NamaManager=e.NamaManager,this.defaultItem.MenuCode=e.MenuCode,this.defaultItem.MenuTable=e.MenuTable,this.statusAdd=!1,this.dialog=!0},selectedManager:function(e){if(console.log(e),null!=e){for(var t=0;t<this.itemsMenu.length;t++)if(this.itemsEmp[t].nik==e){this.defaultItem.IdManager=this.itemsEmp[t].nik,this.defaultItem.NamaManager=this.itemsEmp[t].name;break}}else this.defaultItem.IdManager="-",this.defaultItem.NamaManager="-"},selectedMenuAccess:function(e){if(null!=e){for(var t=this.defaultItem.MenuTable,a=!1,n=0;n<t.length;n++)if(t[n].MenuCode==e){a=!0;break}if(0==a){for(var s={MenuCode:"",MenuName:""},r=0;r<this.itemsMenu.length;r++)if(this.itemsMenu[r].id==e){s.MenuCode=this.itemsMenu[r].id,s.MenuName=this.itemsMenu[r].name;break}this.defaultItem.MenuTable.push(s),this.snackbar=!0,this.colorsnackbar="green",this.textsnackbar="Sukses Tambah Menu Access"}else this.snackbar=!0,this.colorsnackbar="red",this.textsnackbar="Menu Sudah Ada Bro..!!!"}},deletelistmenu:function(e){var t=this;return Object(r["a"])(regeneratorRuntime.mark((function a(){return regeneratorRuntime.wrap((function(a){while(1)switch(a.prev=a.next){case 0:return console.log(e),a.next=3,t.defaultItem.MenuTable.indexOf(e);case 3:return t.editedIndex=a.sent,a.next=6,Object.assign({},e);case 6:t.editedItem=a.sent,t.defaultItem.MenuTable.splice(t.editedIndex,1);case 8:case"end":return a.stop()}}),a)})))()},save:function(){if(0!=this.defaultItem.IdEmp.length){for(var e="",t="",a=0;a<this.defaultItem.MenuTable.length;a++)t=0==a?this.defaultItem.MenuTable[a].MenuCode:t+","+this.defaultItem.MenuTable[a].MenuCode;e="["+t+"]",console.log(e);var n={nik:this.defaultItem.IdEmp,manager_code:this.defaultItem.IdManager,menu_access:e,NamaEmp:this.defaultItem.NamaEmp,NamaManager:this.defaultItem.NamaManager,MenuTable:this.defaultItem.MenuTable};console.log(n),0==this.statusAdd&&this.Update(n)}else this.snackbar=!0,this.colorsnackbar="red",this.textsnackbar="Gagal Simpan, Semua kolom tidak boleh ada yang kosong"},close:function(){this.dialog=!1}}},c=i,d=a("2877"),u=a("6544"),m=a.n(u),h=a("c6a6"),p=a("2bc5"),v=a("8336"),g=a("b0af"),b=a("99d9"),f=a("cc20"),k=a("62ad"),M=a("a523"),x=a("8fea"),I=a("169a"),_=a("ce7e"),w=a("132d"),C=a("e449"),E=a("0fd9"),A=a("1f4f"),N=a("2db4"),y=a("2fa4"),S=a("8654"),T=a("71d9"),V=Object(d["a"])(c,n,s,!1,null,null,null);t["default"]=V.exports;m()(V,{VAutocomplete:h["a"],VBreadcrumbs:p["a"],VBtn:v["a"],VCard:g["a"],VCardActions:b["a"],VCardText:b["c"],VCardTitle:b["d"],VChip:f["a"],VCol:k["a"],VContainer:M["a"],VDataTable:x["a"],VDialog:I["a"],VDivider:_["a"],VIcon:w["a"],VMenu:C["a"],VRow:E["a"],VSimpleTable:A["a"],VSnackbar:N["a"],VSpacer:y["a"],VTextField:S["a"],VToolbar:T["a"]})}}]);
//# sourceMappingURL=chunk-2d225625.2220bcd1.js.map