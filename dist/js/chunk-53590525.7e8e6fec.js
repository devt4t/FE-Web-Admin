(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-53590525"],{"2bc5":function(e,t,a){"use strict";var n=a("5530"),s=(a("a15b"),a("abd3"),a("ade3")),i=a("1c87"),r=a("58df"),o=Object(r["a"])(i["a"]).extend({name:"v-breadcrumbs-item",props:{activeClass:{type:String,default:"v-breadcrumbs__item--disabled"},ripple:{type:[Boolean,Object],default:!1}},computed:{classes:function(){return Object(s["a"])({"v-breadcrumbs__item":!0},this.activeClass,this.disabled)}},render:function(e){var t=this.generateRouteLink(),a=t.tag,s=t.data;return e("li",[e(a,Object(n["a"])(Object(n["a"])({},s),{},{attrs:Object(n["a"])(Object(n["a"])({},s.attrs),{},{"aria-current":this.isActive&&this.isLink?"page":void 0})}),this.$slots.default)])}}),l=a("80d2"),c=Object(l["i"])("v-breadcrumbs__divider","li"),u=a("7560");t["a"]=Object(r["a"])(u["a"]).extend({name:"v-breadcrumbs",props:{divider:{type:String,default:"/"},items:{type:Array,default:function(){return[]}},large:Boolean},computed:{classes:function(){return Object(n["a"])({"v-breadcrumbs--large":this.large},this.themeClasses)}},methods:{genDivider:function(){return this.$createElement(c,this.$slots.divider?this.$slots.divider:this.divider)},genItems:function(){for(var e=[],t=!!this.$scopedSlots.item,a=[],n=0;n<this.items.length;n++){var s=this.items[n];a.push(s.text),t?e.push(this.$scopedSlots.item({item:s})):e.push(this.$createElement(o,{key:a.join("."),props:s},[s.text])),n<this.items.length-1&&e.push(this.genDivider())}return e}},render:function(e){var t=this.$slots.default||this.genItems();return e("ul",{staticClass:"v-breadcrumbs",class:this.classes},t)}})},"2bfd":function(e,t,a){},"2db4":function(e,t,a){"use strict";var n=a("ade3"),s=(a("a9e3"),a("caad"),a("ca71"),a("8dd9")),i=a("a9ad"),r=a("7560"),o=a("f2e7"),l=a("fe6c"),c=a("58df"),u=a("80d2"),d=a("d9bd");t["a"]=Object(c["a"])(s["a"],i["a"],o["a"],Object(l["b"])(["absolute","bottom","left","right","top"])).extend({name:"v-snackbar",props:{app:Boolean,centered:Boolean,contentClass:{type:String,default:""},multiLine:Boolean,text:Boolean,timeout:{type:[Number,String],default:5e3},transition:{type:[Boolean,String],default:"v-snack-transition",validator:function(e){return"string"===typeof e||!1===e}},vertical:Boolean},data:function(){return{activeTimeout:-1}},computed:{classes:function(){return{"v-snack--absolute":this.absolute,"v-snack--active":this.isActive,"v-snack--bottom":this.bottom||!this.top,"v-snack--centered":this.centered,"v-snack--has-background":this.hasBackground,"v-snack--left":this.left,"v-snack--multi-line":this.multiLine&&!this.vertical,"v-snack--right":this.right,"v-snack--text":this.text,"v-snack--top":this.top,"v-snack--vertical":this.vertical}},hasBackground:function(){return!this.text&&!this.outlined},isDark:function(){return this.hasBackground?!this.light:r["a"].options.computed.isDark.call(this)},styles:function(){if(this.absolute)return{};var e=this.$vuetify.application,t=e.bar,a=e.bottom,n=e.footer,s=e.insetFooter,i=e.left,r=e.right,o=e.top;return{paddingBottom:Object(u["g"])(a+n+s),paddingLeft:this.app?Object(u["g"])(i):void 0,paddingRight:this.app?Object(u["g"])(r):void 0,paddingTop:Object(u["g"])(t+o)}}},watch:{isActive:"setTimeout",timeout:"setTimeout"},mounted:function(){this.isActive&&this.setTimeout()},created:function(){this.$attrs.hasOwnProperty("auto-height")&&Object(d["e"])("auto-height",this),0==this.timeout&&Object(d["d"])('timeout="0"',"-1",this)},methods:{genActions:function(){return this.$createElement("div",{staticClass:"v-snack__action "},[Object(u["s"])(this,"action",{attrs:{class:"v-snack__btn"}})])},genContent:function(){return this.$createElement("div",{staticClass:"v-snack__content",class:Object(n["a"])({},this.contentClass,!0),attrs:{role:"status","aria-live":"polite"}},[Object(u["s"])(this)])},genWrapper:function(){var e=this,t=this.hasBackground?this.setBackgroundColor:this.setTextColor,a=t(this.color,{staticClass:"v-snack__wrapper",class:s["a"].options.computed.classes.call(this),style:s["a"].options.computed.styles.call(this),directives:[{name:"show",value:this.isActive}],on:{mouseenter:function(){return window.clearTimeout(e.activeTimeout)},mouseleave:this.setTimeout}});return this.$createElement("div",a,[this.genContent(),this.genActions()])},genTransition:function(){return this.$createElement("transition",{props:{name:this.transition}},[this.genWrapper()])},setTimeout:function(){var e=this;window.clearTimeout(this.activeTimeout);var t=Number(this.timeout);this.isActive&&![0,-1].includes(t)&&(this.activeTimeout=window.setTimeout((function(){e.isActive=!1}),t))}},render:function(e){return e("div",{staticClass:"v-snack",class:this.classes,style:this.styles},[!1!==this.transition?this.genTransition():this.genWrapper()])}})},"4bd4":function(e,t,a){"use strict";var n=a("5530"),s=(a("caad"),a("2532"),a("07ac"),a("4de4"),a("159b"),a("7db0"),a("58df")),i=a("7e2b"),r=a("3206");t["a"]=Object(s["a"])(i["a"],Object(r["b"])("form")).extend({name:"v-form",provide:function(){return{form:this}},inheritAttrs:!1,props:{disabled:Boolean,lazyValidation:Boolean,readonly:Boolean,value:Boolean},data:function(){return{inputs:[],watchers:[],errorBag:{}}},watch:{errorBag:{handler:function(e){var t=Object.values(e).includes(!0);this.$emit("input",!t)},deep:!0,immediate:!0}},methods:{watchInput:function(e){var t=this,a=function(e){return e.$watch("hasError",(function(a){t.$set(t.errorBag,e._uid,a)}),{immediate:!0})},n={_uid:e._uid,valid:function(){},shouldValidate:function(){}};return this.lazyValidation?n.shouldValidate=e.$watch("shouldValidate",(function(s){s&&(t.errorBag.hasOwnProperty(e._uid)||(n.valid=a(e)))})):n.valid=a(e),n},validate:function(){return 0===this.inputs.filter((function(e){return!e.validate(!0)})).length},reset:function(){this.inputs.forEach((function(e){return e.reset()})),this.resetErrorBag()},resetErrorBag:function(){var e=this;this.lazyValidation&&setTimeout((function(){e.errorBag={}}),0)},resetValidation:function(){this.inputs.forEach((function(e){return e.resetValidation()})),this.resetErrorBag()},register:function(e){this.inputs.push(e),this.watchers.push(this.watchInput(e))},unregister:function(e){var t=this.inputs.find((function(t){return t._uid===e._uid}));if(t){var a=this.watchers.find((function(e){return e._uid===t._uid}));a&&(a.valid(),a.shouldValidate()),this.watchers=this.watchers.filter((function(e){return e._uid!==t._uid})),this.inputs=this.inputs.filter((function(e){return e._uid!==t._uid})),this.$delete(this.errorBag,t._uid)}}},render:function(e){var t=this;return e("form",{staticClass:"v-form",attrs:Object(n["a"])({novalidate:!0},this.attrs$),on:{submit:function(e){return t.$emit("submit",e)}}},this.$slots.default)}})},"53c6":function(e,t,a){"use strict";a.r(t);var n=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",[a("v-breadcrumbs",{staticClass:"breadcrumbsmain",attrs:{dark:"dark"==e.$store.state.theme,items:e.itemsbr,divider:">",large:"","data-aos":"fade-right"}}),a("v-data-table",{staticClass:"rounded-xl elevation-6 mx-3 pa-1",attrs:{headers:e.headers,items:e.dataobject,search:e.search,loading:e.table.loading,"data-aos":"fade-up","data-aos-delay":"200"},on:{"update:page":function(t){return e.page=t},"update:items-per-page":function(t){return e.itemsPerPage=t}},scopedSlots:e._u([{key:"top",fn:function(){return[a("v-toolbar",{staticClass:"rounded-xl",attrs:{flat:""}},[a("v-text-field",{staticStyle:{"max-width":"350px"},attrs:{"append-icon":"mdi-magnify",label:"Search",placeholder:"Search...","hide-details":"",dense:"",rounded:"",outlined:"",color:"green"},model:{value:e.search,callback:function(t){e.search=t},expression:"search"}}),a("v-divider",{staticClass:"mx-2"}),a("v-btn",{staticClass:"mb-2",attrs:{dark:"",rounded:"",color:"green"},on:{click:function(t){return e.showAddModal()}}},[a("v-icon",{attrs:{small:""}},[e._v("mdi-plus")]),e._v(" Add Item ")],1),a("v-dialog",{attrs:{"max-width":"700px"},model:{value:e.dialog,callback:function(t){e.dialog=t},expression:"dialog"}},[a("v-card",[a("v-form",{ref:"form",attrs:{"lazy-validation":""},model:{value:e.valid,callback:function(t){e.valid=t},expression:"valid"}},[a("v-card-title",[a("span",{staticClass:"headline"},[e._v(e._s(e.formTitle))])]),a("v-card-text",[a("v-container",[a("v-row",[a("v-col",{attrs:{cols:"12",sm:"6",md:"6"}},[a("v-text-field",{attrs:{label:"Nama",rules:e.rules},model:{value:e.defaultItem.name,callback:function(t){e.$set(e.defaultItem,"name",t)},expression:"defaultItem.name"}})],1),a("v-col",{attrs:{cols:"12",sm:"6",md:"6"}},[a("v-text-field",{attrs:{label:"Email",rules:e.rules},model:{value:e.defaultItem.email,callback:function(t){e.$set(e.defaultItem,"email",t)},expression:"defaultItem.email"}})],1)],1),1==e.typeAdd?a("v-row",[a("v-col",{attrs:{cols:"12",sm:"4",md:"4"}},[a("v-select",{attrs:{items:e.itemsType,"item-value":"value","item-text":"text",label:"Pilih Type",rules:e.rules},on:{change:e.selectedType},model:{value:e.defaultItem.type,callback:function(t){e.$set(e.defaultItem,"type",t)},expression:"defaultItem.type"}})],1),1==e.typeselectedFF?a("v-col",{attrs:{cols:"12",sm:"8",md:"8"}},[a("v-autocomplete",{attrs:{items:e.itemsFF,"item-value":"ff_no","item-text":"namaFF",label:"Pilih FF",clearable:""},model:{value:e.defaultItem.employee_no,callback:function(t){e.$set(e.defaultItem,"employee_no",t)},expression:"defaultItem.employee_no"}})],1):e._e(),0==e.typeselectedFF?a("v-col",{attrs:{cols:"12",sm:"8",md:"8"}},[a("v-autocomplete",{attrs:{items:e.itemsEmp,"item-value":"nik","item-text":"name",label:"Pilih Employee",clearable:""},model:{value:e.defaultItem.employee_no,callback:function(t){e.$set(e.defaultItem,"employee_no",t)},expression:"defaultItem.employee_no"}})],1):e._e()],1):e._e()],1)],1),a("v-card-actions",[a("v-spacer"),a("v-btn",{attrs:{color:"blue darken-1",text:""},on:{click:e.close}},[e._v(" Cancel ")]),a("v-btn",{attrs:{color:"blue darken-1",text:""},on:{click:e.save}},[e._v(" Save ")])],1)],1)],1)],1),a("v-dialog",{attrs:{"max-width":"500px"},model:{value:e.dialogReset,callback:function(t){e.dialogReset=t},expression:"dialogReset"}},[a("v-card",[a("v-card-title",{staticClass:"headline"},[e._v("Are you sure you want to reset password?")]),a("v-card-actions",[a("v-spacer"),a("v-btn",{attrs:{color:"blue darken-1",text:""},on:{click:e.closeDelete}},[e._v("Cancel")]),a("v-btn",{attrs:{color:"blue darken-1",text:""},on:{click:e.resetItemConfirm}},[e._v("OK")]),a("v-spacer")],1)],1)],1),a("v-dialog",{attrs:{"max-width":"500px"},model:{value:e.dialogDelete,callback:function(t){e.dialogDelete=t},expression:"dialogDelete"}},[a("v-card",[a("v-card-title",{staticClass:"headline"},[e._v("Are you sure you want to delete this item?")]),a("v-card-actions",[a("v-spacer"),a("v-btn",{attrs:{color:"blue darken-1",text:""},on:{click:e.closeDelete}},[e._v("Cancel")]),a("v-btn",{attrs:{color:"blue darken-1",text:""},on:{click:e.deleteItemConfirm}},[e._v("OK")]),a("v-spacer")],1)],1)],1)],1)]},proxy:!0},{key:"item.no",fn:function(t){var a=t.index;return[e._v(" "+e._s(e.itemsPerPage*(e.page-1)+a+1)+" ")]}},{key:"item.actions",fn:function(t){var n=t.item;return[a("v-icon",{staticClass:"mr-2",attrs:{color:"warning"},on:{click:function(t){return e.editItem(n)}}},[e._v(" mdi-pencil ")]),a("v-icon",{attrs:{color:"red"},on:{click:function(t){return e.resetItem(n)}}},[e._v(" mdi-autorenew ")]),a("v-icon",{attrs:{color:"red"},on:{click:function(t){return e.deleteItem(n)}}},[e._v(" mdi-delete ")])]}}])}),a("v-snackbar",{attrs:{color:e.colorsnackbar,timeout:e.timeoutsnackbar},model:{value:e.snackbar,callback:function(t){e.snackbar=t},expression:"snackbar"}},[e._v(" "+e._s(e.textsnackbar)+" ")])],1)},s=[],i=a("1da1"),r=(a("b0c0"),a("96cf"),a("bc3a")),o=a.n(r),l={name:"Users",data:function(){return{page:1,itemsPerPage:10,itemsbr:[{text:"Users",disabled:!0,href:"breadcrumbs_dashboard"},{text:"Users",disabled:!0,href:"breadcrumbs_link_1"}],rules:[function(e){return!!e||"Required."},function(e){return e&&e.length>=1||"Min 1 characters"}],alerttoken:!1,formTitle:"Add Item",value:"add",dialog:!1,dialogDelete:!1,dialogDetail:!1,dialogReset:!1,search:"",valid:!0,authtoken:"",BaseUrlGet:"",dataobject:[],headers:[{text:"No",value:"no"},{text:"Kode Pegawai",align:"start",value:"employee_no",width:"15%"},{text:"Nama",value:"name",width:"25%"},{text:"Role",value:"role",width:"20%"},{text:"Email",value:"email",width:"25%"},{text:"Actions",value:"actions",sortable:!1,width:"15%"}],defaultItem:{id:"",employee_no:"",name:"",role:"",email:"",type:""},itemsType:[{text:"FF",value:"FF"},{text:"Employee",value:"Employee"}],itemsEmp:[],itemsFF:[],itemsPositionEmp:[],typeselectedFF:!0,typeAdd:!0,snackbar:!1,textsnackbar:"Test",timeoutsnackbar:2e3,colorsnackbar:null,table:{loading:!1}}},created:function(){this.authtoken=localStorage.getItem("token"),this.BaseUrlGet=localStorage.getItem("BaseUrlGet"),this.initialize(),this.GetEmp(),this.GetFF(),this.GetJobPosition()},methods:{initialize:function(){var e=this;return Object(i["a"])(regeneratorRuntime.mark((function t(){var a;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.prev=0,e.table.loading=!0,t.next=4,o.a.get(e.BaseUrlGet+"GetUser",{headers:{Authorization:"Bearer "+e.authtoken}});case 4:a=t.sent,console.log(a.data.data.result.data),0!=a.data.length?e.dataobject=a.data.data.result.data:(console.log("Kosong"),e.dataobject=[]),t.next=13;break;case 9:t.prev=9,t.t0=t["catch"](0),console.error(t.t0),401==t.t0.response.status?(e.alerttoken=!0,localStorage.removeItem("token"),e.$router.push("/")):e.dataobject=[];case 13:return t.prev=13,e.table.loading=!1,t.finish(13);case 16:case"end":return t.stop()}}),t,null,[[0,9,13,16]])})))()},GetEmp:function(){var e=this;return Object(i["a"])(regeneratorRuntime.mark((function t(){var a;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,o.a.get(e.BaseUrlGet+"GetEmployeeAll",{headers:{Authorization:"Bearer "+e.authtoken}});case 3:a=t.sent,console.log(a.data.data.result.data),0!=a.data.length?e.itemsEmp=a.data.data.result.data:(console.log("Kosong"),e.itemsEmp=[]),t.next=12;break;case 8:t.prev=8,t.t0=t["catch"](0),console.error(t.t0),401==t.t0.response.status?(e.alerttoken=!0,localStorage.removeItem("token"),e.$router.push("/")):e.itemsEmp=[];case 12:case"end":return t.stop()}}),t,null,[[0,8]])})))()},GetFF:function(){var e=this;return Object(i["a"])(regeneratorRuntime.mark((function t(){var a;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,o.a.get(e.BaseUrlGet+"GetFieldFacilitatorAllWeb",{headers:{Authorization:"Bearer "+e.authtoken}});case 3:a=t.sent,console.log(a.data.data.result.data),0!=a.data.length?e.itemsFF=a.data.data.result.data:(console.log("Kosong"),e.itemsFF=[]),t.next=12;break;case 8:t.prev=8,t.t0=t["catch"](0),console.error(t.t0),401==t.t0.response.status?(e.alerttoken=!0,localStorage.removeItem("token"),e.$router.push("/")):e.itemsFF=[];case 12:case"end":return t.stop()}}),t,null,[[0,8]])})))()},GetJobPosition:function(){var e=this;return Object(i["a"])(regeneratorRuntime.mark((function t(){var a;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,o.a.get(e.BaseUrlGet+"GetJobPosition",{headers:{Authorization:"Bearer "+e.authtoken}});case 3:a=t.sent,console.log(a.data.data.result.data),0!=a.data.length?e.itemsPositionEmp=a.data.data.result.data:(console.log("Kosong"),e.itemsPositionEmp=[]),t.next=12;break;case 8:t.prev=8,t.t0=t["catch"](0),console.error(t.t0),401==t.t0.response.status?(e.alerttoken=!0,localStorage.removeItem("token"),e.$router.push("/")):e.itemsPositionEmp=[];case 12:case"end":return t.stop()}}),t,null,[[0,8]])})))()},addData:function(){var e=this;return Object(i["a"])(regeneratorRuntime.mark((function t(){var a,n;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return console.log(e.defaultItem.id),a={employee_no:e.defaultItem.employee_no,name:e.defaultItem.name,email:e.defaultItem.email,password:"123456",role:e.defaultItem.type},console.log(a),t.prev=3,t.next=6,o.a.post(e.BaseUrlGet+"Regist",a,{headers:{Authorization:"Bearer "+e.authtoken}});case 6:n=t.sent,console.log(n.data.data.result),"success"==n.data.data.result?(e.dialog=!1,e.snackbar=!0,e.colorsnackbar="green",e.textsnackbar="Sukses mengubah data",e.initialize()):(e.dialog=!0,e.snackbar=!0,e.colorsnackbar="red",e.textsnackbar="Gagal mengubah data"),t.next=15;break;case 11:t.prev=11,t.t0=t["catch"](3),console.error(t.t0.response),401==t.t0.response.status?(e.dialog=!0,e.snackbar=!0,e.colorsnackbar="red",e.textsnackbar="Gagal mengubah data",localStorage.removeItem("token"),e.$router.push("/")):(e.dialog=!0,e.snackbar=!0,e.colorsnackbar="red",e.textsnackbar="Gagal mengubah data");case 15:case"end":return t.stop()}}),t,null,[[3,11]])})))()},updateData:function(){var e=this;return Object(i["a"])(regeneratorRuntime.mark((function t(){var a,n;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return console.log(e.defaultItem.id),a={employee_no:e.defaultItem.employee_no,name:e.defaultItem.name,email:e.defaultItem.email},console.log(a),t.prev=3,t.next=6,o.a.post(e.BaseUrlGet+"EditUser",a,{headers:{Authorization:"Bearer "+e.authtoken}});case 6:n=t.sent,console.log(n.data.data.result),"success"==n.data.data.result?(e.dialog=!1,e.snackbar=!0,e.colorsnackbar="green",e.textsnackbar="Sukses mengubah data",e.initialize()):(e.dialog=!0,e.snackbar=!0,e.colorsnackbar="red",e.textsnackbar="Gagal mengubah data"),t.next=15;break;case 11:t.prev=11,t.t0=t["catch"](3),console.error(t.t0.response),401==t.t0.response.status?(e.dialog=!0,e.snackbar=!0,e.colorsnackbar="red",e.textsnackbar="Gagal mengubah data",localStorage.removeItem("token"),e.$router.push("/")):(e.dialog=!0,e.snackbar=!0,e.colorsnackbar="red",e.textsnackbar="Gagal mengubah data");case 15:case"end":return t.stop()}}),t,null,[[3,11]])})))()},resetItemConfirm:function(){var e=this;return Object(i["a"])(regeneratorRuntime.mark((function t(){var a,n;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return console.log(e.defaultItem.employee_no),a={employee_no:e.defaultItem.employee_no,email:e.defaultItem.email},console.log(a),t.prev=3,t.next=6,o.a.post(e.BaseUrlGet+"ResetPasswordUser",a,{headers:{Authorization:"Bearer "+e.authtoken}});case 6:n=t.sent,console.log(n.data.data.result),"success"==n.data.data.result?(e.dialog=!1,e.snackbar=!0,e.colorsnackbar="green",e.textsnackbar="Sukses mengubah data",e.initialize()):(e.dialog=!0,e.snackbar=!0,e.colorsnackbar="red",e.textsnackbar="Gagal mengubah data"),t.next=15;break;case 11:t.prev=11,t.t0=t["catch"](3),console.error(t.t0.response),401==t.t0.response.status?(e.dialog=!0,e.snackbar=!0,e.colorsnackbar="red",e.textsnackbar="Gagal mengubah data",localStorage.removeItem("token"),e.$router.push("/")):(e.dialog=!0,e.snackbar=!0,e.colorsnackbar="red",e.textsnackbar="Gagal mengubah data");case 15:case"end":return t.stop()}}),t,null,[[3,11]])})))()},verifDelete:function(){var e=this;return Object(i["a"])(regeneratorRuntime.mark((function t(){var a,n;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return a={id:e.defaultItem.id},console.log(a),t.prev=2,t.next=5,o.a.post(e.BaseUrlGet+"DeleteUser",a,{headers:{Authorization:"Bearer "+e.authtoken}});case 5:n=t.sent,console.log(n.data.data.result),"success"==n.data.data.result?(e.dialogDelete=!1,e.snackbar=!0,e.colorsnackbar="green",e.textsnackbar="Sukses hapus data",e.initialize()):e.dialogDelete=!1,t.next=14;break;case 10:t.prev=10,t.t0=t["catch"](2),console.error(t.t0.response),401==t.t0.response.status&&(e.dialogDelete=!1);case 14:case"end":return t.stop()}}),t,null,[[2,10]])})))()},deleteItemConfirm:function(){this.verifDelete()},close:function(){this.dialog=!1},closeDelete:function(){this.dialogDelete=!1},deleteItem:function(e){this.defaultItem.id=e.id,this.dialogDelete=!0},resetItem:function(e){this.defaultItem.employee_no=e.employee_no,this.defaultItem.email=e.email,this.dialogReset=!0},showAddModal:function(){this.defaultItem.id="",this.defaultItem.name="",this.defaultItem.role="",this.defaultItem.employee_no="",this.defaultItem.email="",this.defaultItem.type="FF",this.formTitle="Add Item",this.typeAdd=!0,this.dialog=!0},editItem:function(e){console.log(e),this.defaultItem.id=e.id,this.defaultItem.employee_no=e.employee_no,this.defaultItem.name=e.name,this.defaultItem.role=e.role,this.defaultItem.email=e.email,"ff"==e.role?(this.defaultItem.type="FF",this.typeselectedFF=!0):(this.defaultItem.type="Employee",this.typeselectedFF=!1),this.formTitle="Edit Item",this.typeAdd=!1,this.dialog=!0},selectedType:function(e){console.log(e),"FF"==e?(this.typeselectedFF=!0,this.defaultItem.type=e):(this.typeselectedFF=!1,this.defaultItem.type=e)},save:function(){this.$refs.form.validate(),0!=this.defaultItem.name.length&&null!=this.defaultItem.type&&null!=this.defaultItem.employee_no&&0!=this.defaultItem.email.length?this.defaultItem.id?this.updateData():this.addData():(this.snackbar=!0,this.colorsnackbar="red",this.textsnackbar="Gagal Simpan, Semua kolom tidak boleh ada yang kosong")}}},c=l,u=a("2877"),d=a("6544"),h=a.n(d),m=a("c6a6"),p=a("2bc5"),f=a("8336"),v=a("b0af"),g=a("99d9"),b=a("62ad"),k=a("a523"),I=a("8fea"),x=a("169a"),y=a("ce7e"),S=a("4bd4"),w=a("132d"),_=a("0fd9"),C=a("b974"),F=a("2db4"),O=a("2fa4"),j=a("8654"),D=a("71d9"),B=Object(u["a"])(c,n,s,!1,null,null,null);t["default"]=B.exports;h()(B,{VAutocomplete:m["a"],VBreadcrumbs:p["a"],VBtn:f["a"],VCard:v["a"],VCardActions:g["a"],VCardText:g["c"],VCardTitle:g["d"],VCol:b["a"],VContainer:k["a"],VDataTable:I["a"],VDialog:x["a"],VDivider:y["a"],VForm:S["a"],VIcon:w["a"],VRow:_["a"],VSelect:C["a"],VSnackbar:F["a"],VSpacer:O["a"],VTextField:j["a"],VToolbar:D["a"]})},a523:function(e,t,a){"use strict";a("4de4"),a("b64b"),a("2ca0"),a("99af"),a("20f6"),a("4b85");var n=a("e8f2"),s=a("d9f7");t["a"]=Object(n["a"])("container").extend({name:"v-container",functional:!0,props:{id:String,tag:{type:String,default:"div"},fluid:{type:Boolean,default:!1}},render:function(e,t){var a,n=t.props,i=t.data,r=t.children,o=i.attrs;return o&&(i.attrs={},a=Object.keys(o).filter((function(e){if("slot"===e)return!1;var t=o[e];return e.startsWith("data-")?(i.attrs[e]=t,!1):t||"string"===typeof t}))),n.id&&(i.domProps=i.domProps||{},i.domProps.id=n.id),e(n.tag,Object(s["a"])(i,{staticClass:"container",class:Array({"container--fluid":n.fluid}).concat(a||[])}),r)}})},abd3:function(e,t,a){},c6a6:function(e,t,a){"use strict";var n=a("5530"),s=(a("d81d"),a("4de4"),a("498a"),a("7db0"),a("caad"),a("2532"),a("2bfd"),a("b974")),i=a("8654"),r=a("d9f7"),o=a("80d2"),l=Object(n["a"])(Object(n["a"])({},s["b"]),{},{offsetY:!0,offsetOverflow:!0,transition:!1});t["a"]=s["a"].extend({name:"v-autocomplete",props:{allowOverflow:{type:Boolean,default:!0},autoSelectFirst:{type:Boolean,default:!1},filter:{type:Function,default:function(e,t,a){return a.toLocaleLowerCase().indexOf(t.toLocaleLowerCase())>-1}},hideNoData:Boolean,menuProps:{type:s["a"].options.props.menuProps.type,default:function(){return l}},noFilter:Boolean,searchInput:{type:String}},data:function(){return{lazySearch:this.searchInput}},computed:{classes:function(){return Object(n["a"])(Object(n["a"])({},s["a"].options.computed.classes.call(this)),{},{"v-autocomplete":!0,"v-autocomplete--is-selecting-index":this.selectedIndex>-1})},computedItems:function(){return this.filteredItems},selectedValues:function(){var e=this;return this.selectedItems.map((function(t){return e.getValue(t)}))},hasDisplayedItems:function(){var e=this;return this.hideSelected?this.filteredItems.some((function(t){return!e.hasItem(t)})):this.filteredItems.length>0},currentRange:function(){return null==this.selectedItem?0:String(this.getText(this.selectedItem)).length},filteredItems:function(){var e=this;return!this.isSearching||this.noFilter||null==this.internalSearch?this.allItems:this.allItems.filter((function(t){var a=Object(o["r"])(t,e.itemText),n=null!=a?String(a):"";return e.filter(t,String(e.internalSearch),n)}))},internalSearch:{get:function(){return this.lazySearch},set:function(e){this.lazySearch!==e&&(this.lazySearch=e,this.$emit("update:search-input",e))}},isAnyValueAllowed:function(){return!1},isDirty:function(){return this.searchIsDirty||this.selectedItems.length>0},isSearching:function(){return this.multiple&&this.searchIsDirty||this.searchIsDirty&&this.internalSearch!==this.getText(this.selectedItem)},menuCanShow:function(){return!!this.isFocused&&(this.hasDisplayedItems||!this.hideNoData)},$_menuProps:function(){var e=s["a"].options.computed.$_menuProps.call(this);return e.contentClass="v-autocomplete__content ".concat(e.contentClass||"").trim(),Object(n["a"])(Object(n["a"])({},l),e)},searchIsDirty:function(){return null!=this.internalSearch&&""!==this.internalSearch},selectedItem:function(){var e=this;return this.multiple?null:this.selectedItems.find((function(t){return e.valueComparator(e.getValue(t),e.getValue(e.internalValue))}))},listData:function(){var e=s["a"].options.computed.listData.call(this);return e.props=Object(n["a"])(Object(n["a"])({},e.props),{},{items:this.virtualizedItems,noFilter:this.noFilter||!this.isSearching||!this.filteredItems.length,searchInput:this.internalSearch}),e}},watch:{filteredItems:"onFilteredItemsChanged",internalValue:"setSearch",isFocused:function(e){e?(document.addEventListener("copy",this.onCopy),this.$refs.input&&this.$refs.input.select()):(document.removeEventListener("copy",this.onCopy),this.$refs.input&&this.$refs.input.blur(),this.updateSelf())},isMenuActive:function(e){!e&&this.hasSlot&&(this.lazySearch=null)},items:function(e,t){t&&t.length||!this.hideNoData||!this.isFocused||this.isMenuActive||!e.length||this.activateMenu()},searchInput:function(e){this.lazySearch=e},internalSearch:"onInternalSearchChanged",itemText:"updateSelf"},created:function(){this.setSearch()},destroyed:function(){document.removeEventListener("copy",this.onCopy)},methods:{onFilteredItemsChanged:function(e,t){var a=this;e!==t&&(this.setMenuIndex(-1),this.$nextTick((function(){a.internalSearch&&(1===e.length||a.autoSelectFirst)&&(a.$refs.menu.getTiles(),a.setMenuIndex(0))})))},onInternalSearchChanged:function(){this.updateMenuDimensions()},updateMenuDimensions:function(){this.isMenuActive&&this.$refs.menu&&this.$refs.menu.updateDimensions()},changeSelectedIndex:function(e){this.searchIsDirty||(this.multiple&&e===o["y"].left?-1===this.selectedIndex?this.selectedIndex=this.selectedItems.length-1:this.selectedIndex--:this.multiple&&e===o["y"].right?this.selectedIndex>=this.selectedItems.length-1?this.selectedIndex=-1:this.selectedIndex++:e!==o["y"].backspace&&e!==o["y"].delete||this.deleteCurrentItem())},deleteCurrentItem:function(){var e=this.selectedIndex,t=this.selectedItems[e];if(this.isInteractive&&!this.getDisabled(t)){var a=this.selectedItems.length-1;if(-1!==this.selectedIndex||0===a){var n=this.selectedItems.length,s=e!==n-1?e:e-1,i=this.selectedItems[s];i?this.selectItem(t):this.setValue(this.multiple?[]:null),this.selectedIndex=s}else this.selectedIndex=a}},clearableCallback:function(){this.internalSearch=null,s["a"].options.methods.clearableCallback.call(this)},genInput:function(){var e=i["a"].options.methods.genInput.call(this);return e.data=Object(r["a"])(e.data,{attrs:{"aria-activedescendant":Object(o["p"])(this.$refs.menu,"activeTile.id"),autocomplete:Object(o["p"])(e.data,"attrs.autocomplete","off")},domProps:{value:this.internalSearch}}),e},genInputSlot:function(){var e=s["a"].options.methods.genInputSlot.call(this);return e.data.attrs.role="combobox",e},genSelections:function(){return this.hasSlot||this.multiple?s["a"].options.methods.genSelections.call(this):[]},onClick:function(e){this.isInteractive&&(this.selectedIndex>-1?this.selectedIndex=-1:this.onFocus(),this.isAppendInner(e.target)||this.activateMenu())},onInput:function(e){if(!(this.selectedIndex>-1)&&e.target){var t=e.target,a=t.value;t.value&&this.activateMenu(),this.internalSearch=a,this.badInput=t.validity&&t.validity.badInput}},onKeyDown:function(e){var t=e.keyCode;!e.ctrlKey&&[o["y"].home,o["y"].end].includes(t)||s["a"].options.methods.onKeyDown.call(this,e),this.changeSelectedIndex(t)},onSpaceDown:function(e){},onTabDown:function(e){s["a"].options.methods.onTabDown.call(this,e),this.updateSelf()},onUpDown:function(e){e.preventDefault(),this.activateMenu()},selectItem:function(e){s["a"].options.methods.selectItem.call(this,e),this.setSearch()},setSelectedItems:function(){s["a"].options.methods.setSelectedItems.call(this),this.isFocused||this.setSearch()},setSearch:function(){var e=this;this.$nextTick((function(){e.multiple&&e.internalSearch&&e.isMenuActive||(e.internalSearch=!e.selectedItems.length||e.multiple||e.hasSlot?null:e.getText(e.selectedItem))}))},updateSelf:function(){(this.searchIsDirty||this.internalValue)&&(this.valueComparator(this.internalSearch,this.getValue(this.internalValue))||this.setSearch())},hasItem:function(e){return this.selectedValues.indexOf(this.getValue(e))>-1},onCopy:function(e){var t,a;if(-1!==this.selectedIndex){var n=this.selectedItems[this.selectedIndex],s=this.getText(n);null==(t=e.clipboardData)||t.setData("text/plain",s),null==(a=e.clipboardData)||a.setData("text/vnd.vuetify.autocomplete.item+plain",s),e.preventDefault()}}}})},ca71:function(e,t,a){},e8f2:function(e,t,a){"use strict";a.d(t,"a",(function(){return s}));a("498a"),a("99af"),a("4de4"),a("b64b"),a("2ca0"),a("a15b");var n=a("2b0e");function s(e){return n["default"].extend({name:"v-".concat(e),functional:!0,props:{id:String,tag:{type:String,default:"div"}},render:function(t,a){var n=a.props,s=a.data,i=a.children;s.staticClass="".concat(e," ").concat(s.staticClass||"").trim();var r=s.attrs;if(r){s.attrs={};var o=Object.keys(r).filter((function(e){if("slot"===e)return!1;var t=r[e];return e.startsWith("data-")?(s.attrs[e]=t,!1):t||"string"===typeof t}));o.length&&(s.staticClass+=" ".concat(o.join(" ")))}return n.id&&(s.domProps=s.domProps||{},s.domProps.id=n.id),t(n.tag,s,i)}})}}}]);
//# sourceMappingURL=chunk-53590525.7e8e6fec.js.map