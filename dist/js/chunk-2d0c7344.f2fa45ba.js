(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d0c7344"],{"502e":function(t,a,e){"use strict";e.r(a);var n=function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("v-dialog",{attrs:{scrollable:"","max-width":"2500px",transition:"dialog-transition","content-class":"rounded-xl"},model:{value:t.showModal,callback:function(a){t.showModal=a},expression:"showModal"}},[e("v-card",[t.data?e("v-card-title",{staticClass:"rounded-xl green darken-3 ma-1 pa-2 white--text"},[e("v-icon",{staticClass:"mx-2",attrs:{color:"white"}},[t._v("mdi-account-details")]),t._v(" Export Data Sostam "),e("v-icon",{staticClass:"ml-auto",attrs:{color:"white"},on:{click:function(a){t.showModal=!1}}},[t._v("mdi-close-circle")])],1):t._e(),e("v-card-text",[e("v-overlay",{staticClass:"rounded-xl",attrs:{absolute:"",value:t.table.loading.show}},[e("div",{staticClass:"d-flex flex-column justify-center align-center"},[e("p",{staticClass:"mt-2 mb-0"},[t._v(" "+t._s(t.table.loading.text)+" "),e("v-progress-circular",{attrs:{size:17,width:3,indeterminate:"",color:"white"}})],1)])]),e("v-row",{staticClass:"align-center ma-0 my-2"},[t._v(" FF: "+t._s(t.data&&t.data.name_ff||"-")+" "),e("v-divider",{staticClass:"mx-2"})],1),e("table",{staticStyle:{border:"2px solid black","border-collapse":"collapse","min-height":"200px"},attrs:{id:"tabelForExportSostam",border:"1"}},[e("tr",[e("th",{staticStyle:{"text-align":"center","font-size":"15px"},attrs:{colspan:t.table.headers.length,align:"center"}},[t._v("Tahun Program: "+t._s(t.data&&t.data.program_year||""))])]),e("tr",[e("th",{staticStyle:{"text-align":"center","font-size":"20px"},attrs:{colspan:t.table.headers.length,align:"center"}},[e("h2",[t._v(" Data Sostam FF "+t._s(t.data&&t.data.name_ff||"-")+" ")])])]),e("tr",[e("td",{staticStyle:{"text-align":"center"},attrs:{colspan:t.table.headers.length}},[e("small",[t._v(" Export Time: "+t._s(Date())+" ")])])]),e("tr",[e("td",{attrs:{colspan:t.table.headers.length}})]),e("tr",t._l(t.table.headers,(function(a){return e("th",{key:"tabelForExportSostam"+a.value,staticClass:"green darken-2 white--text"},[t._v(" "+t._s(a.text)+" "),"land_area"==a.value?e("div",[t._v("(m"),e("sup",[t._v("2")]),t._v(")")]):t._e(),"planting_area"==a.value?e("div",[t._v("(m"),e("sup",[t._v("2")]),t._v(")")]):t._e()])})),0),t._l(t.table.items,(function(a,n){return e("tr",{key:"itemtableForExportLahanPetaniDashboard"+n,class:(n%2==0?"white":"grey")+" lighten-4"},t._l(t.table.headers,(function(s,o){return e("td",{key:"tableItemForExportLahanPetaniDashboard"+s.value,class:"\n                         lighten-3"},["index"==s.value?e("span",[t._v(" "+t._s(n+1)+" ")]):e("span",[t._v(" "+t._s(a[s.value])+" ")])])})),0)}))],2)],1),e("v-card-actions",{staticClass:"justify-center align-center"},[e("v-btn",{attrs:{disabled:t.table.loading.show,color:"green white--text",rounded:""},on:{click:function(a){return t.downloadExcel()}}},[e("v-icon",{staticClass:"mr-1"},[t._v("mdi-microsoft-excel")]),t._v(" Unduh Excel")],1),e("v-btn",{attrs:{disabled:t.table.loading.show,color:"orange darken-2 white--text",rounded:""},on:{click:function(a){return t.downloadPDF()}}},[e("v-icon",{staticClass:"mr-1"},[t._v("mdi-file-pdf-box")]),t._v(" Unduh PDF")],1)],1)],1)],1)},s=[],o=e("1da1"),r=(e("96cf"),e("99af"),e("caad"),e("2532"),e("d3b7"),e("3ca3"),e("ddb0"),e("2b3d"),e("bc3a")),i=e.n(r),l=(e("c1df"),e("3d20")),c=e.n(l),d={props:{show:{type:Boolean,default:!1},data:{type:Object,default:null}},data:function(){return{table:{headers:[{text:"No",value:"index",width:75},{text:"No Form",value:"form_no"},{text:"Nama FF",value:"ff"},{text:"Petani",value:"petani"},{text:"No Lahan",value:"lahanNo"},{text:"Desa",value:"desa"},{text:"Tanggal Sosialisasi",value:"soc_date"},{text:"Jumlah Pohon Kayu",value:"pohon_kayu"},{text:"Jumlah Pohon MPTS",value:"pohon_mpts"},{text:"Jumlah Total Bibit",value:"max_seed_amount"},{text:"Pembuatan Lubang Tanam",value:"pembuatan_lubang_tanam"},{text:"Waktu Distribusi",value:"distribution_time"},{text:"Koordinat Distribusi",value:"distribution_coordinates"},{text:"Lokasi Distribusi",value:"distribution_location"},{text:"Waktu Tanam",value:"planting_time"},{text:"Status",value:"status"}],items:[],items_raw:[],loading:{show:!1,text:"Loading..."},search:""}}},computed:{showModal:{get:function(){return this.show&&this.getTableData({ff_no:this.data.ff_no,program_year:this.data.program_year}),this.show},set:function(t){var a=this;t||(setTimeout((function(){a.table.items=[],a.table.items_raw=[]}),200),this.$emit("close",!1))}}},methods:{downloadExcel:function(){var t=document.getElementById("tabelForExportSostam"),a=XLSX.utils.table_to_book(t);XLSX.writeFile(a,"DataSostam".concat(this.data.program_year,"-").concat(this.data.ff_no,"_").concat(this.data.name_ff,".xlsx"))},downloadPDF:function(){window.jsPDF=window.jspdf.jsPDF;var t=new jsPDF({orientation:"landscape",unit:"px",format:[1400,700]});t.autoTable({html:"#tabelForExportSostam",useCss:!0,tableLineWidth:0,theme:"striped"}),t.save("DataSostam".concat(this.data.program_year,"-").concat(this.data.ff_no,"_").concat(this.data.name_ff,".pdf"))},errorResponse:function(t){var a=this;return Object(o["a"])(regeneratorRuntime.mark((function e(){var n,s;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(console.log(t),!t.response){e.next=9;break}if(!t.response.status){e.next=9;break}if(401!=t.response.status){e.next=8;break}return e.next=6,c.a.fire({title:"Session Ended!",text:"Please login again.",icon:"warning",confirmButtonColor:"#2e7d32",confirmButtonText:"Okay"});case 6:n=e.sent,n&&(localStorage.removeItem("token"),a.$router.push("/"));case 8:500!==t.response.status&&400!==t.response.status||(s=t.response.data.message,s&&s.includes("Duplicate entry")&&(s="Data sudah ada!"),c.a.fire({title:"Error!",text:"".concat(s||t.message),icon:"error",confirmButtonColor:"#f44336"}));case 9:case"end":return e.stop()}}),e)})))()},getTableData:function(t){var a=this;return Object(o["a"])(regeneratorRuntime.mark((function e(){var n,s,o,r;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.prev=0,a.table.loading.show=!0,n=new URLSearchParams(t),s="ExportSostamAllSuperAdmin?".concat(n),e.next=6,i.a.get(a.$store.getters.getApiUrl(s),a.$store.state.apiConfig);case 6:o=e.sent,r=o.data,a.table.items=r,a.table.items_raw=r,e.next=15;break;case 12:e.prev=12,e.t0=e["catch"](0),a.errorResponse(e.t0);case 15:return e.prev=15,a.table.loading.show=!1,e.finish(15);case 18:case"end":return e.stop()}}),e,null,[[0,12,15,18]])})))()}}},u=d,m=e("2877"),h=e("6544"),v=e.n(h),p=e("8336"),x=e("b0af"),b=e("99d9"),f=e("169a"),_=e("ce7e"),g=e("132d"),w=e("a797"),k=e("490a"),y=e("0fd9"),D=Object(m["a"])(u,n,s,!1,null,null,null);a["default"]=D.exports;v()(D,{VBtn:p["a"],VCard:x["a"],VCardActions:b["a"],VCardText:b["c"],VCardTitle:b["d"],VDialog:f["a"],VDivider:_["a"],VIcon:g["a"],VOverlay:w["a"],VProgressCircular:k["a"],VRow:y["a"]})}}]);
//# sourceMappingURL=chunk-2d0c7344.f2fa45ba.js.map