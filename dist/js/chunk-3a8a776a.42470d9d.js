(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-3a8a776a","chunk-2d0f02ad"],{"16c6":function(t,e,a){"use strict";a.r(e);var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("f-c-detail",{attrs:{show:t.dialogs.fc_detail.show,data:t.dialogs.fc_detail.data},on:{dialogActions:function(e){return t.dialogActions(e)}}}),a("v-dialog",{attrs:{scrollable:"","max-width":"1000px",transition:"dialog-transition","content-class":"rounded-xl"},model:{value:t.showModal,callback:function(e){t.showModal=e},expression:"showModal"}},[a("v-card",[a("v-card-title",{staticClass:"rounded-xl green darken-3 ma-1 pa-2 white--text"},[a("v-icon",{staticClass:"mx-2",attrs:{color:"white"}},[t._v("mdi-account-details")]),t._v(" Unit Manager "),a("v-icon",{staticClass:"ml-auto",attrs:{color:"white"},on:{click:function(e){t.showModal=!1}}},[t._v("mdi-close-circle")])],1),a("v-card-text",[a("v-row",{staticClass:"align-center ma-0 my-2"},[a("v-divider",{staticClass:"mx-2"}),t._e()],1),t.tableItems?a("v-data-table",{staticClass:"elevation-1 rounded-xl",staticStyle:{position:"relative"},attrs:{headers:t.table.headers,items:t.table.items,loading:t.table.loading.show,"loading-text":t.table.loading.text,search:t.table.loading.search},scopedSlots:t._u([{key:"top",fn:function(){return[a("v-overlay",{attrs:{absolute:"",color:"white",value:t.table.loading.show}},[a("div",{staticClass:"d-flex flex-column justify-center align-center"},[a("v-progress-circular",{attrs:{size:80,width:10,indeterminate:"",color:"green"}}),a("p",{staticClass:"mt-2 mb-0 green--text text--darken-2"},[t._v(t._s(t.table.loading.text))])],1)])]},proxy:!0},{key:"item.index",fn:function(e){var n=e.index;return[a("div",[t._v(" "+t._s(n+1)+" ")])]}},{key:"item.action",fn:function(e){e.index;var n=e.item;return[a("v-btn",{staticClass:"pl-1",attrs:{small:"",rounded:"",color:"green white--text"},on:{click:function(e){return t.dialogActions(!0,n)}}},[a("v-icon",{staticClass:"mr-1"},[t._v("mdi-information")]),t._v(" Detail FC ")],1)]}}],null,!1,2497967480)}):t._e()],1)],1)],1)],1)},r=[],o=a("3835"),i=a("1da1"),s=(a("96cf"),a("caad"),a("2532"),a("b0c0"),a("d3b7"),a("3ca3"),a("ddb0"),a("2b3d"),a("4fad"),a("99af"),a("bc3a")),l=a.n(s),c=(a("c1df"),a("3d20")),d=a.n(c),u=a("9ae4"),m={name:"OldGEKOUMDetail",components:{FCDetail:u["default"]},props:{show:{type:Boolean,default:!1},data:{type:Object,default:null}},data:function(){return{dialogs:{fc_detail:{show:!1,data:null}},options:{programYear:""},table:{headers:[{text:"No",value:"index",width:75},{text:"ID Karyawan (GEKO)",value:"nik"},{text:"Nama UM",value:"name"},{text:"Email",value:"email"},{text:"NIK / No KTP",value:"ktp_no"},{text:"Total FC",value:"total_fc"},{text:"",value:"action"}],items:[],loading:{show:!1,text:"Loading..."},search:""}}},computed:{showModal:{get:function(){return this.show&&(this.options.programYear=this.data.programYear),this.show},set:function(t){t||this.$emit("dialogActions",!1)}},tableItems:function(){return this.show&&this.options.programYear&&this.getTableData({program_year:this.options.programYear,position_no:20}),!0}},mounted:function(){},methods:{errorResponse:function(t){var e=this;return Object(i["a"])(regeneratorRuntime.mark((function a(){var n,r;return regeneratorRuntime.wrap((function(a){while(1)switch(a.prev=a.next){case 0:if(console.log(t),!t.response){a.next=9;break}if(!t.response.status){a.next=9;break}if(401!=t.response.status){a.next=8;break}return a.next=6,d.a.fire({title:"Session Ended!",text:"Please login again.",icon:"warning",confirmButtonColor:"#2e7d32",confirmButtonText:"Okay"});case 6:n=a.sent,n&&(localStorage.removeItem("token"),e.$router.push("/"));case 8:500!==t.response.status&&400!==t.response.status||(r=t.response.data.message,r&&r.includes("Duplicate entry")&&(r="Data sudah ada!"),d.a.fire({title:"Error!",text:"".concat(r||t.message),icon:"error",confirmButtonColor:"#f44336"}));case 9:case"end":return a.stop()}}),a)})))()},dialogActions:function(t){var e=arguments,a=this;return Object(i["a"])(regeneratorRuntime.mark((function n(){var r;return regeneratorRuntime.wrap((function(n){while(1)switch(n.prev=n.next){case 0:r=e.length>1&&void 0!==e[1]?e[1]:null,a.User,r&&(a.dialogs.fc_detail.data={umNo:r.nik,umName:r.name,programYear:a.options.programYear}),a.dialogs.fc_detail.show=t;case 4:case"end":return n.stop()}}),n)})))()},getTableData:function(t){var e=this;return Object(i["a"])(regeneratorRuntime.mark((function a(){var n,r,i,s,c,d,u;return regeneratorRuntime.wrap((function(a){while(1)switch(a.prev=a.next){case 0:return e.table.loading.show=!0,e.table.loading.text="Mengambil data...",n=new URLSearchParams(t),r="GetEmployeeAll?".concat(n),a.next=6,l.a.get(e.$store.getters.getApiUrl(r),e.$store.state.apiConfig);case 6:if(i=a.sent,s=i.data.data.result.data,e.table.items=[],!(s.length>0)){a.next=19;break}s.sort((function(t,e){return t.name.localeCompare(e.name)})),e.table.loading.text="Mengambil data UM 0 / ".concat(s.length),c=regeneratorRuntime.mark((function t(){var a,n,r,i;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return a=Object(o["a"])(u[d],2),n=a[0],r=a[1],i=new URLSearchParams({program_year:e.options.programYear,manager_code:r.nik,position:19}),t.next=4,l.a.get(e.$store.getters.getApiUrl("GetEmployeebyManager?".concat(i)),e.$store.state.apiConfig).then((function(t){r.total_fc=t.data.data.result.data.length})).catch((function(){r.total_fc=0}));case 4:r.email&&r.total_fc>0&&e.table.items.push(r),e.table.loading.text="Mengambil data UM ".concat(parseInt(n)+1," / ").concat(s.length);case 6:case"end":return t.stop()}}),t)})),d=0,u=Object.entries(s);case 14:if(!(d<u.length)){a.next=19;break}return a.delegateYield(c(),"t0",16);case 16:d++,a.next=14;break;case 19:e.table.loading.show=!1;case 20:case"end":return a.stop()}}),a)})))()}}},g=m,f=a("2877"),p=a("6544"),h=a.n(p),v=a("8336"),b=a("b0af"),x=a("99d9"),w=a("8fea"),_=a("169a"),k=a("ce7e"),C=a("132d"),y=a("a797"),D=a("490a"),M=a("0fd9"),O=a("b974"),V=Object(f["a"])(g,n,r,!1,null,null,null);e["default"]=V.exports;h()(V,{VBtn:v["a"],VCard:b["a"],VCardText:x["c"],VCardTitle:x["d"],VDataTable:w["a"],VDialog:_["a"],VDivider:k["a"],VIcon:C["a"],VOverlay:y["a"],VProgressCircular:D["a"],VRow:M["a"],VSelect:O["a"]})},"9ae4":function(t,e,a){"use strict";a.r(e);var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("f-f-detail",{attrs:{show:t.dialogs.ff_detail.show,data:t.dialogs.ff_detail.data},on:{dialogActions:function(e){return t.dialogActions(e)}}}),a("v-dialog",{attrs:{scrollable:"","max-width":"1100px",transition:"dialog-transition","content-class":"rounded-xl"},model:{value:t.showModal,callback:function(e){t.showModal=e},expression:"showModal"}},[a("v-card",[a("v-card-title",{staticClass:"rounded-xl green darken-3 ma-1 pa-2 white--text"},[a("v-icon",{staticClass:"mx-2",attrs:{color:"white"}},[t._v("mdi-account-details")]),t._v(" Field Coordinator "),a("v-icon",{staticClass:"ml-auto",attrs:{color:"white"},on:{click:function(e){t.showModal=!1}}},[t._v("mdi-close-circle")])],1),a("v-card-text",[a("v-row",{staticClass:"align-center ma-0 my-2"},[t._v(" UM: "+t._s(t.data&&t.data.umName||"-")+" "),a("v-divider",{staticClass:"mx-2"}),a("v-select",{staticClass:"mt-2 mr-1",staticStyle:{"max-width":"175px"},attrs:{dense:"",color:"success","item-color":"success","menu-props":{rounded:"xl",offsetY:!0,transition:"slide-y-transition"},"hide-details":"",rounded:"",disabled:t.table.loading.show,items:t.$store.state.programYear.options,label:"Program Year",rules:[function(t){return!!t||"Field is required"}],outlined:""},model:{value:t.options.programYear,callback:function(e){t.$set(t.options,"programYear",e)},expression:"options.programYear"}})],1),t.tableItems?a("v-data-table",{staticClass:"elevation-1 rounded-xl",staticStyle:{position:"relative"},attrs:{headers:t.table.headers,items:t.table.items,loading:t.table.loading.show,"loading-text":t.table.loading.text,search:t.table.loading.search},scopedSlots:t._u([{key:"top",fn:function(){return[a("v-overlay",{attrs:{absolute:"",color:"white",value:t.table.loading.show}},[a("div",{staticClass:"d-flex flex-column justify-center align-center"},[a("v-progress-circular",{attrs:{size:80,width:10,indeterminate:"",color:"green"}}),a("p",{staticClass:"mt-2 mb-0 green--text text--darken-2"},[t._v(t._s(t.table.loading.text))])],1)])]},proxy:!0},{key:"item.index",fn:function(e){var n=e.index;return[a("div",[t._v(" "+t._s(n+1)+" ")])]}},{key:"item.action",fn:function(e){e.index;var n=e.item;return[a("v-btn",{staticClass:"pl-1",attrs:{small:"",rounded:"",color:"green white--text"},on:{click:function(e){return t.dialogActions(!0,n)}}},[a("v-icon",{staticClass:"mr-1"},[t._v("mdi-information")]),t._v(" Detail ")],1)]}}],null,!1,1230711933)}):t._e()],1)],1)],1)],1)},r=[],o=a("3835"),i=a("1da1"),s=(a("96cf"),a("caad"),a("2532"),a("b0c0"),a("d3b7"),a("3ca3"),a("ddb0"),a("2b3d"),a("4fad"),a("99af"),a("bc3a")),l=a.n(s),c=(a("c1df"),a("3d20")),d=a.n(c),u=a("6635"),m={name:"OldGEKOFCDetail",components:{FFDetail:u["default"]},props:{show:{type:Boolean,default:!1},data:{type:Object,default:null}},data:function(){return{dialogs:{ff_detail:{show:!1,data:null}},options:{programYear:""},table:{headers:[{text:"No",value:"index",width:75},{text:"ID Karyawan (GEKO)",value:"nik"},{text:"Nama FC",value:"name"},{text:"Email",value:"email"},{text:"NIK / No KTP",value:"ktp_no"},{text:"Total FF",value:"total_ff"},{text:"",value:"action"}],items:[],loading:{show:!1,text:"Loading..."},search:""}}},computed:{showModal:{get:function(){return this.show&&this.data.umNo&&this.data.programYear&&(this.options.programYear=this.data.programYear),this.show},set:function(t){t||this.$emit("dialogActions",!1)}},tableItems:function(){return this.show&&this.data.umNo&&this.options.programYear&&this.getTableData({program_year:this.options.programYear,manager_code:this.data.umNo,position:19}),!0}},mounted:function(){},methods:{errorResponse:function(t){var e=this;return Object(i["a"])(regeneratorRuntime.mark((function a(){var n,r;return regeneratorRuntime.wrap((function(a){while(1)switch(a.prev=a.next){case 0:if(console.log(t),!t.response){a.next=9;break}if(!t.response.status){a.next=9;break}if(401!=t.response.status){a.next=8;break}return a.next=6,d.a.fire({title:"Session Ended!",text:"Please login again.",icon:"warning",confirmButtonColor:"#2e7d32",confirmButtonText:"Okay"});case 6:n=a.sent,n&&(localStorage.removeItem("token"),e.$router.push("/"));case 8:500!==t.response.status&&400!==t.response.status||(r=t.response.data.message,r&&r.includes("Duplicate entry")&&(r="Data sudah ada!"),d.a.fire({title:"Error!",text:"".concat(r||t.message),icon:"error",confirmButtonColor:"#f44336"}));case 9:case"end":return a.stop()}}),a)})))()},dialogActions:function(t){var e=arguments,a=this;return Object(i["a"])(regeneratorRuntime.mark((function n(){var r;return regeneratorRuntime.wrap((function(n){while(1)switch(n.prev=n.next){case 0:r=e.length>1&&void 0!==e[1]?e[1]:null,a.User,r&&(a.dialogs.ff_detail.data={fcNo:r.nik,fcName:r.name,programYear:a.options.programYear}),a.dialogs.ff_detail.show=t;case 4:case"end":return n.stop()}}),n)})))()},getTableData:function(t){var e=this;return Object(i["a"])(regeneratorRuntime.mark((function a(){var n,r,i,s,c,d,u,m,g,f,p;return regeneratorRuntime.wrap((function(a){while(1)switch(a.prev=a.next){case 0:return a.prev=0,e.table.loading.show=!0,e.table.loading.text="Mengambil data...",n=new URLSearchParams(t),r="GetEmployeebyManager?".concat(n),a.next=7,l.a.get(e.$store.getters.getApiUrl(r),e.$store.state.apiConfig);case 7:if(i=a.sent,s=i.data.data.result.data,e.table.items=[],!(s.length>0)){a.next=26;break}s.sort((function(t,e){return t.name.localeCompare(e.name)})),e.table.loading.text="Mengambil data FC 0 / ".concat(s.length),c=0,d=Object.entries(s);case 14:if(!(c<d.length)){a.next=26;break}return u=Object(o["a"])(d[c],2),m=u[0],g=u[1],f=new URLSearchParams({program_year:t.program_year,fc_no:g.nik}),a.next=19,l.a.get(e.$store.getters.getApiUrl("Dashboard/DetailFieldFacilitator?".concat(f)),e.$store.state.apiConfig);case 19:p=a.sent,g.total_ff=p.data.length,e.table.items.push(g),e.table.loading.text="Mengambil data FC ".concat(parseInt(m)+1," / ").concat(s.length);case 23:c++,a.next=14;break;case 26:a.next=31;break;case 28:a.prev=28,a.t0=a["catch"](0),e.errorResponse(a.t0);case 31:return a.prev=31,e.table.loading.show=!1,a.finish(31);case 34:case"end":return a.stop()}}),a,null,[[0,28,31,34]])})))()}}},g=m,f=a("2877"),p=a("6544"),h=a.n(p),v=a("8336"),b=a("b0af"),x=a("99d9"),w=a("8fea"),_=a("169a"),k=a("ce7e"),C=a("132d"),y=a("a797"),D=a("490a"),M=a("0fd9"),O=a("b974"),V=Object(f["a"])(g,n,r,!1,null,null,null);e["default"]=V.exports;h()(V,{VBtn:v["a"],VCard:b["a"],VCardText:x["c"],VCardTitle:x["d"],VDataTable:w["a"],VDialog:_["a"],VDivider:k["a"],VIcon:C["a"],VOverlay:y["a"],VProgressCircular:D["a"],VRow:M["a"],VSelect:O["a"]})}}]);
//# sourceMappingURL=chunk-3a8a776a.42470d9d.js.map