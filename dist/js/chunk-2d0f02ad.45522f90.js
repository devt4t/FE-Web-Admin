(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d0f02ad"],{"9ae4":function(e,t,a){"use strict";a.r(t);var r=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",[a("f-f-detail",{attrs:{show:e.dialogs.ff_detail.show,data:e.dialogs.ff_detail.data},on:{dialogActions:function(t){return e.dialogActions(t)}}}),a("v-dialog",{attrs:{scrollable:"","max-width":"1100px",transition:"dialog-transition","content-class":"rounded-xl"},model:{value:e.showModal,callback:function(t){e.showModal=t},expression:"showModal"}},[a("v-card",[a("v-card-title",{staticClass:"rounded-xl green darken-3 ma-1 pa-2 white--text"},[a("v-icon",{staticClass:"mx-2",attrs:{color:"white"}},[e._v("mdi-account-details")]),e._v(" Field Coordinator "),a("v-icon",{staticClass:"ml-auto",attrs:{color:"white"},on:{click:function(t){e.showModal=!1}}},[e._v("mdi-close-circle")])],1),a("v-card-text",[a("v-row",{staticClass:"align-center ma-0 my-2"},[e._v(" UM: "+e._s(e.data&&e.data.umName||"-")+" "),a("v-divider",{staticClass:"mx-2"}),a("v-select",{staticClass:"mt-2 mr-1",staticStyle:{"max-width":"175px"},attrs:{dense:"",color:"success","item-color":"success","menu-props":{rounded:"xl",offsetY:!0,transition:"slide-y-transition"},"hide-details":"",rounded:"",disabled:e.table.loading.show,items:e.$store.state.programYear.options,label:"Program Year",rules:[function(e){return!!e||"Field is required"}],outlined:""},model:{value:e.options.programYear,callback:function(t){e.$set(e.options,"programYear",t)},expression:"options.programYear"}})],1),e.tableItems?a("v-data-table",{staticClass:"elevation-1 rounded-xl",staticStyle:{position:"relative"},attrs:{headers:e.table.headers,items:e.table.items,loading:e.table.loading.show,"loading-text":e.table.loading.text,search:e.table.loading.search},scopedSlots:e._u([{key:"top",fn:function(){return[a("v-overlay",{attrs:{absolute:"",color:"white",value:e.table.loading.show}},[a("div",{staticClass:"d-flex flex-column justify-center align-center"},[a("v-progress-circular",{attrs:{size:80,width:10,indeterminate:"",color:"green"}}),a("p",{staticClass:"mt-2 mb-0 green--text text--darken-2"},[e._v(e._s(e.table.loading.text))])],1)])]},proxy:!0},{key:"item.index",fn:function(t){var r=t.index;return[a("div",[e._v(" "+e._s(r+1)+" ")])]}},{key:"item.action",fn:function(t){t.index;var r=t.item;return[a("v-btn",{staticClass:"pl-1",attrs:{small:"",rounded:"",color:"green white--text"},on:{click:function(t){return e.dialogActions(!0,r)}}},[a("v-icon",{staticClass:"mr-1"},[e._v("mdi-information")]),e._v(" Detail ")],1)]}}],null,!1,1230711933)}):e._e()],1)],1)],1)],1)},n=[],o=a("3835"),s=a("1da1"),i=(a("96cf"),a("caad"),a("2532"),a("b0c0"),a("d3b7"),a("3ca3"),a("ddb0"),a("2b3d"),a("4fad"),a("99af"),a("bc3a")),l=a.n(i),c=(a("c1df"),a("3d20")),d=a.n(c),u=a("6635"),m={name:"OldGEKOFCDetail",components:{FFDetail:u["default"]},props:{show:{type:Boolean,default:!1},data:{type:Object,default:null}},data:function(){return{dialogs:{ff_detail:{show:!1,data:null}},options:{programYear:""},table:{headers:[{text:"No",value:"index",width:75},{text:"ID Karyawan (GEKO)",value:"nik"},{text:"Nama FC",value:"name"},{text:"Email",value:"email"},{text:"NIK / No KTP",value:"ktp_no"},{text:"Total FF",value:"total_ff"},{text:"",value:"action"}],items:[],loading:{show:!1,text:"Loading..."},search:""}}},computed:{showModal:{get:function(){return this.show&&this.data.umNo&&this.data.programYear&&(this.options.programYear=this.data.programYear),this.show},set:function(e){e||this.$emit("dialogActions",!1)}},tableItems:function(){return this.show&&this.data.umNo&&this.options.programYear&&this.getTableData({program_year:this.options.programYear,manager_code:this.data.umNo,position:19}),!0}},mounted:function(){},methods:{errorResponse:function(e){var t=this;return Object(s["a"])(regeneratorRuntime.mark((function a(){var r,n;return regeneratorRuntime.wrap((function(a){while(1)switch(a.prev=a.next){case 0:if(console.log(e),!e.response){a.next=9;break}if(!e.response.status){a.next=9;break}if(401!=e.response.status){a.next=8;break}return a.next=6,d.a.fire({title:"Session Ended!",text:"Please login again.",icon:"warning",confirmButtonColor:"#2e7d32",confirmButtonText:"Okay"});case 6:r=a.sent,r&&(localStorage.removeItem("token"),t.$router.push("/"));case 8:500!==e.response.status&&400!==e.response.status||(n=e.response.data.message,n&&n.includes("Duplicate entry")&&(n="Data sudah ada!"),d.a.fire({title:"Error!",text:"".concat(n||e.message),icon:"error",confirmButtonColor:"#f44336"}));case 9:case"end":return a.stop()}}),a)})))()},dialogActions:function(e){var t=arguments,a=this;return Object(s["a"])(regeneratorRuntime.mark((function r(){var n;return regeneratorRuntime.wrap((function(r){while(1)switch(r.prev=r.next){case 0:n=t.length>1&&void 0!==t[1]?t[1]:null,a.User,n&&(a.dialogs.ff_detail.data={fcNo:n.nik,fcName:n.name,programYear:a.options.programYear}),a.dialogs.ff_detail.show=e;case 4:case"end":return r.stop()}}),r)})))()},getTableData:function(e){var t=this;return Object(s["a"])(regeneratorRuntime.mark((function a(){var r,n,s,i,c,d,u,m,g,p,f;return regeneratorRuntime.wrap((function(a){while(1)switch(a.prev=a.next){case 0:return a.prev=0,t.table.loading.show=!0,t.table.loading.text="Mengambil data...",r=new URLSearchParams(e),n="GetEmployeebyManager?".concat(r),a.next=7,l.a.get(t.$store.getters.getApiUrl(n),t.$store.state.apiConfig);case 7:if(s=a.sent,i=s.data.data.result.data,t.table.items=[],!(i.length>0)){a.next=26;break}i.sort((function(e,t){return e.name.localeCompare(t.name)})),t.table.loading.text="Mengambil data FC 0 / ".concat(i.length),c=0,d=Object.entries(i);case 14:if(!(c<d.length)){a.next=26;break}return u=Object(o["a"])(d[c],2),m=u[0],g=u[1],p=new URLSearchParams({program_year:e.program_year,fc_no:g.nik}),a.next=19,l.a.get(t.$store.getters.getApiUrl("Dashboard/DetailFieldFacilitator?".concat(p)),t.$store.state.apiConfig);case 19:f=a.sent,g.total_ff=f.data.length,t.table.items.push(g),t.table.loading.text="Mengambil data FC ".concat(parseInt(m)+1," / ").concat(i.length);case 23:c++,a.next=14;break;case 26:a.next=31;break;case 28:a.prev=28,a.t0=a["catch"](0),t.errorResponse(a.t0);case 31:return a.prev=31,t.table.loading.show=!1,a.finish(31);case 34:case"end":return a.stop()}}),a,null,[[0,28,31,34]])})))()}}},g=m,p=a("2877"),f=a("6544"),h=a.n(f),v=a("8336"),b=a("b0af"),x=a("99d9"),w=a("8fea"),k=a("169a"),_=a("ce7e"),C=a("132d"),y=a("a797"),Y=a("490a"),D=a("0fd9"),F=a("b974"),O=Object(p["a"])(g,r,n,!1,null,null,null);t["default"]=O.exports;h()(O,{VBtn:v["a"],VCard:b["a"],VCardText:x["c"],VCardTitle:x["d"],VDataTable:w["a"],VDialog:k["a"],VDivider:_["a"],VIcon:C["a"],VOverlay:y["a"],VProgressCircular:Y["a"],VRow:D["a"],VSelect:F["a"]})}}]);
//# sourceMappingURL=chunk-2d0f02ad.45522f90.js.map