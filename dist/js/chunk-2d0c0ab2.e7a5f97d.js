(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d0c0ab2"],{4385:function(t,e,a){"use strict";a.r(e);var i=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("v-app",{attrs:{id:"Trees"}},[a("v-navigation-drawer",{attrs:{app:""},model:{value:t.drawer,callback:function(e){t.drawer=e},expression:"drawer"}},[a("v-list-item",[a("v-list-item-content",[a("v-list-item-title",{staticClass:"title"},[t._v(" Admin ")]),a("v-list-item-subtitle",[t._v(" System Management ")])],1)],1),a("v-divider"),a("v-list",{attrs:{color:"transparent"}},t._l(t.items,(function(e){return a("v-list-group",{key:e.title,attrs:{"prepend-icon":e.icon,"no-action":""},scopedSlots:t._u([{key:"activator",fn:function(){return[a("v-list-item-content",[a("v-list-item-title",{domProps:{textContent:t._s(e.title)}})],1)]},proxy:!0}],null,!0),model:{value:e.active,callback:function(a){t.$set(e,"active",a)},expression:"item.active"}},t._l(e.items,(function(e){return a("v-list-item",{key:e.title,attrs:{to:e.to,link:""}},[a("v-list-item-content",[a("v-list-item-title",{domProps:{textContent:t._s(e.title)}})],1)],1)})),1)})),1)],1),a("v-app-bar",{attrs:{app:""}},[a("v-app-bar-nav-icon",{on:{click:function(e){t.drawer=!t.drawer}}}),a("v-toolbar-title",[t._v("Trees4Trees")]),a("v-spacer"),a("v-btn",{attrs:{text:""},on:{click:function(e){return t.logout()}}},[t._v(" Logout "),a("v-icon",[t._v("mdi-export")])],1)],1),a("v-main",{staticClass:"grey lighten-1 pa-5"},[a("router-view")],1)],1)},o=[],n=a("1da1"),r=(a("96cf"),{data:function(){return{drawer:null,items:[{icon:"mdi-account-group",items:[{title:"Field Facilitator",to:"/Home"}],title:"Employee"},{icon:"mdi-database",active:!1,items:[{title:"Farmer",to:"/Farmer"},{title:"Lahan",to:"/Lahan"},{title:"Trees",to:"/Trees"},{title:"Activity",to:"/Activity"}],title:"Main Data"},{icon:"mdi-cogs",active:!1,items:[{title:"Provinsi",to:"/Provinsi"},{title:"Kab/Kota",to:"/Kabupaten"},{title:"Kecamatan",to:"/Kecamatan"},{title:"Vilage",to:"/Vilage"},{title:"Management Unit",to:"/ManagementUnit"},{title:"Target Area",to:"/TargetArea"}],title:"Utilities"},{icon:"mdi-account",items:[{title:"Users",to:"/Users"}],title:"Users"}],elevations:[6,12,18],BaseUrlGet:""}},methods:{cekLogout:function(){var t=this;return Object(n["a"])(regeneratorRuntime.mark((function e(){var a;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return console.log(t.BaseUrlGet),e.prev=1,e.next=4,axios.post(t.BaseUrlGet+"Logout",{headers:{Authorization:"Bearer "+t.authtoken}});case 4:a=e.sent,console.log(a.data.data.status.code),200==a.data.data.status.code&&(localStorage.removeItem("token"),localStorage.removeItem("BaseUrlGet"),t.$router.push("/")),e.next=12;break;case 9:e.prev=9,e.t0=e["catch"](1),console.error(e.t0.response);case 12:case"end":return e.stop()}}),e,null,[[1,9]])})))()},logout:function(){console.log("test"),this.cekLogout()}}}),s=r,l=a("2877"),c=a("6544"),u=a.n(c),v=a("7496"),m=a("40dc"),p=a("5bc1"),d=a("8336"),g=a("ce7e"),f=a("132d"),b=a("8860"),w=a("56b0"),V=a("da13"),k=a("5d23"),h=a("f6c4"),x=a("f774"),L=a("2fa4"),_=a("2a7f"),T=Object(l["a"])(s,i,o,!1,null,null,null);e["default"]=T.exports;u()(T,{VApp:v["a"],VAppBar:m["a"],VAppBarNavIcon:p["a"],VBtn:d["a"],VDivider:g["a"],VIcon:f["a"],VList:b["a"],VListGroup:w["a"],VListItem:V["a"],VListItemContent:k["a"],VListItemSubtitle:k["b"],VListItemTitle:k["c"],VMain:h["a"],VNavigationDrawer:x["a"],VSpacer:L["a"],VToolbarTitle:_["a"]})}}]);
//# sourceMappingURL=chunk-2d0c0ab2.e7a5f97d.js.map