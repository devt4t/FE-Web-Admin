(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-04cde886"],{"2bc5":function(e,t,a){"use strict";var s=a("5530"),n=(a("a15b"),a("abd3"),a("ade3")),i=a("1c87"),r=a("58df"),o=Object(r["a"])(i["a"]).extend({name:"v-breadcrumbs-item",props:{activeClass:{type:String,default:"v-breadcrumbs__item--disabled"},ripple:{type:[Boolean,Object],default:!1}},computed:{classes:function(){return Object(n["a"])({"v-breadcrumbs__item":!0},this.activeClass,this.disabled)}},render:function(e){var t=this.generateRouteLink(),a=t.tag,n=t.data;return e("li",[e(a,Object(s["a"])(Object(s["a"])({},n),{},{attrs:Object(s["a"])(Object(s["a"])({},n.attrs),{},{"aria-current":this.isActive&&this.isLink?"page":void 0})}),this.$slots.default)])}}),l=a("80d2"),c=Object(l["i"])("v-breadcrumbs__divider","li"),u=a("7560");t["a"]=Object(r["a"])(u["a"]).extend({name:"v-breadcrumbs",props:{divider:{type:String,default:"/"},items:{type:Array,default:function(){return[]}},large:Boolean},computed:{classes:function(){return Object(s["a"])({"v-breadcrumbs--large":this.large},this.themeClasses)}},methods:{genDivider:function(){return this.$createElement(c,this.$slots.divider?this.$slots.divider:this.divider)},genItems:function(){for(var e=[],t=!!this.$scopedSlots.item,a=[],s=0;s<this.items.length;s++){var n=this.items[s];a.push(n.text),t?e.push(this.$scopedSlots.item({item:n})):e.push(this.$createElement(o,{key:a.join("."),props:n},[n.text])),s<this.items.length-1&&e.push(this.genDivider())}return e}},render:function(e){var t=this.$slots.default||this.genItems();return e("ul",{staticClass:"v-breadcrumbs",class:this.classes},t)}})},"2bfd":function(e,t,a){},"2db4":function(e,t,a){"use strict";var s=a("ade3"),n=(a("a9e3"),a("caad"),a("ca71"),a("8dd9")),i=a("a9ad"),r=a("7560"),o=a("f2e7"),l=a("fe6c"),c=a("58df"),u=a("80d2"),d=a("d9bd");t["a"]=Object(c["a"])(n["a"],i["a"],o["a"],Object(l["b"])(["absolute","bottom","left","right","top"])).extend({name:"v-snackbar",props:{app:Boolean,centered:Boolean,contentClass:{type:String,default:""},multiLine:Boolean,text:Boolean,timeout:{type:[Number,String],default:5e3},transition:{type:[Boolean,String],default:"v-snack-transition",validator:function(e){return"string"===typeof e||!1===e}},vertical:Boolean},data:function(){return{activeTimeout:-1}},computed:{classes:function(){return{"v-snack--absolute":this.absolute,"v-snack--active":this.isActive,"v-snack--bottom":this.bottom||!this.top,"v-snack--centered":this.centered,"v-snack--has-background":this.hasBackground,"v-snack--left":this.left,"v-snack--multi-line":this.multiLine&&!this.vertical,"v-snack--right":this.right,"v-snack--text":this.text,"v-snack--top":this.top,"v-snack--vertical":this.vertical}},hasBackground:function(){return!this.text&&!this.outlined},isDark:function(){return this.hasBackground?!this.light:r["a"].options.computed.isDark.call(this)},styles:function(){if(this.absolute)return{};var e=this.$vuetify.application,t=e.bar,a=e.bottom,s=e.footer,n=e.insetFooter,i=e.left,r=e.right,o=e.top;return{paddingBottom:Object(u["g"])(a+s+n),paddingLeft:this.app?Object(u["g"])(i):void 0,paddingRight:this.app?Object(u["g"])(r):void 0,paddingTop:Object(u["g"])(t+o)}}},watch:{isActive:"setTimeout",timeout:"setTimeout"},mounted:function(){this.isActive&&this.setTimeout()},created:function(){this.$attrs.hasOwnProperty("auto-height")&&Object(d["e"])("auto-height",this),0==this.timeout&&Object(d["d"])('timeout="0"',"-1",this)},methods:{genActions:function(){return this.$createElement("div",{staticClass:"v-snack__action "},[Object(u["s"])(this,"action",{attrs:{class:"v-snack__btn"}})])},genContent:function(){return this.$createElement("div",{staticClass:"v-snack__content",class:Object(s["a"])({},this.contentClass,!0),attrs:{role:"status","aria-live":"polite"}},[Object(u["s"])(this)])},genWrapper:function(){var e=this,t=this.hasBackground?this.setBackgroundColor:this.setTextColor,a=t(this.color,{staticClass:"v-snack__wrapper",class:n["a"].options.computed.classes.call(this),style:n["a"].options.computed.styles.call(this),directives:[{name:"show",value:this.isActive}],on:{mouseenter:function(){return window.clearTimeout(e.activeTimeout)},mouseleave:this.setTimeout}});return this.$createElement("div",a,[this.genContent(),this.genActions()])},genTransition:function(){return this.$createElement("transition",{props:{name:this.transition}},[this.genWrapper()])},setTimeout:function(){var e=this;window.clearTimeout(this.activeTimeout);var t=Number(this.timeout);this.isActive&&![0,-1].includes(t)&&(this.activeTimeout=window.setTimeout((function(){e.isActive=!1}),t))}},render:function(e){return e("div",{staticClass:"v-snack",class:this.classes,style:this.styles},[!1!==this.transition?this.genTransition():this.genWrapper()])}})},abd3:function(e,t,a){},c6a6:function(e,t,a){"use strict";var s=a("5530"),n=(a("d81d"),a("4de4"),a("498a"),a("7db0"),a("caad"),a("2532"),a("2bfd"),a("b974")),i=a("8654"),r=a("d9f7"),o=a("80d2"),l=Object(s["a"])(Object(s["a"])({},n["b"]),{},{offsetY:!0,offsetOverflow:!0,transition:!1});t["a"]=n["a"].extend({name:"v-autocomplete",props:{allowOverflow:{type:Boolean,default:!0},autoSelectFirst:{type:Boolean,default:!1},filter:{type:Function,default:function(e,t,a){return a.toLocaleLowerCase().indexOf(t.toLocaleLowerCase())>-1}},hideNoData:Boolean,menuProps:{type:n["a"].options.props.menuProps.type,default:function(){return l}},noFilter:Boolean,searchInput:{type:String}},data:function(){return{lazySearch:this.searchInput}},computed:{classes:function(){return Object(s["a"])(Object(s["a"])({},n["a"].options.computed.classes.call(this)),{},{"v-autocomplete":!0,"v-autocomplete--is-selecting-index":this.selectedIndex>-1})},computedItems:function(){return this.filteredItems},selectedValues:function(){var e=this;return this.selectedItems.map((function(t){return e.getValue(t)}))},hasDisplayedItems:function(){var e=this;return this.hideSelected?this.filteredItems.some((function(t){return!e.hasItem(t)})):this.filteredItems.length>0},currentRange:function(){return null==this.selectedItem?0:String(this.getText(this.selectedItem)).length},filteredItems:function(){var e=this;return!this.isSearching||this.noFilter||null==this.internalSearch?this.allItems:this.allItems.filter((function(t){var a=Object(o["r"])(t,e.itemText),s=null!=a?String(a):"";return e.filter(t,String(e.internalSearch),s)}))},internalSearch:{get:function(){return this.lazySearch},set:function(e){this.lazySearch!==e&&(this.lazySearch=e,this.$emit("update:search-input",e))}},isAnyValueAllowed:function(){return!1},isDirty:function(){return this.searchIsDirty||this.selectedItems.length>0},isSearching:function(){return this.multiple&&this.searchIsDirty||this.searchIsDirty&&this.internalSearch!==this.getText(this.selectedItem)},menuCanShow:function(){return!!this.isFocused&&(this.hasDisplayedItems||!this.hideNoData)},$_menuProps:function(){var e=n["a"].options.computed.$_menuProps.call(this);return e.contentClass="v-autocomplete__content ".concat(e.contentClass||"").trim(),Object(s["a"])(Object(s["a"])({},l),e)},searchIsDirty:function(){return null!=this.internalSearch&&""!==this.internalSearch},selectedItem:function(){var e=this;return this.multiple?null:this.selectedItems.find((function(t){return e.valueComparator(e.getValue(t),e.getValue(e.internalValue))}))},listData:function(){var e=n["a"].options.computed.listData.call(this);return e.props=Object(s["a"])(Object(s["a"])({},e.props),{},{items:this.virtualizedItems,noFilter:this.noFilter||!this.isSearching||!this.filteredItems.length,searchInput:this.internalSearch}),e}},watch:{filteredItems:"onFilteredItemsChanged",internalValue:"setSearch",isFocused:function(e){e?(document.addEventListener("copy",this.onCopy),this.$refs.input&&this.$refs.input.select()):(document.removeEventListener("copy",this.onCopy),this.$refs.input&&this.$refs.input.blur(),this.updateSelf())},isMenuActive:function(e){!e&&this.hasSlot&&(this.lazySearch=null)},items:function(e,t){t&&t.length||!this.hideNoData||!this.isFocused||this.isMenuActive||!e.length||this.activateMenu()},searchInput:function(e){this.lazySearch=e},internalSearch:"onInternalSearchChanged",itemText:"updateSelf"},created:function(){this.setSearch()},destroyed:function(){document.removeEventListener("copy",this.onCopy)},methods:{onFilteredItemsChanged:function(e,t){var a=this;e!==t&&(this.setMenuIndex(-1),this.$nextTick((function(){a.internalSearch&&(1===e.length||a.autoSelectFirst)&&(a.$refs.menu.getTiles(),a.setMenuIndex(0))})))},onInternalSearchChanged:function(){this.updateMenuDimensions()},updateMenuDimensions:function(){this.isMenuActive&&this.$refs.menu&&this.$refs.menu.updateDimensions()},changeSelectedIndex:function(e){this.searchIsDirty||(this.multiple&&e===o["y"].left?-1===this.selectedIndex?this.selectedIndex=this.selectedItems.length-1:this.selectedIndex--:this.multiple&&e===o["y"].right?this.selectedIndex>=this.selectedItems.length-1?this.selectedIndex=-1:this.selectedIndex++:e!==o["y"].backspace&&e!==o["y"].delete||this.deleteCurrentItem())},deleteCurrentItem:function(){var e=this.selectedIndex,t=this.selectedItems[e];if(this.isInteractive&&!this.getDisabled(t)){var a=this.selectedItems.length-1;if(-1!==this.selectedIndex||0===a){var s=this.selectedItems.length,n=e!==s-1?e:e-1,i=this.selectedItems[n];i?this.selectItem(t):this.setValue(this.multiple?[]:null),this.selectedIndex=n}else this.selectedIndex=a}},clearableCallback:function(){this.internalSearch=null,n["a"].options.methods.clearableCallback.call(this)},genInput:function(){var e=i["a"].options.methods.genInput.call(this);return e.data=Object(r["a"])(e.data,{attrs:{"aria-activedescendant":Object(o["p"])(this.$refs.menu,"activeTile.id"),autocomplete:Object(o["p"])(e.data,"attrs.autocomplete","off")},domProps:{value:this.internalSearch}}),e},genInputSlot:function(){var e=n["a"].options.methods.genInputSlot.call(this);return e.data.attrs.role="combobox",e},genSelections:function(){return this.hasSlot||this.multiple?n["a"].options.methods.genSelections.call(this):[]},onClick:function(e){this.isInteractive&&(this.selectedIndex>-1?this.selectedIndex=-1:this.onFocus(),this.isAppendInner(e.target)||this.activateMenu())},onInput:function(e){if(!(this.selectedIndex>-1)&&e.target){var t=e.target,a=t.value;t.value&&this.activateMenu(),this.internalSearch=a,this.badInput=t.validity&&t.validity.badInput}},onKeyDown:function(e){var t=e.keyCode;!e.ctrlKey&&[o["y"].home,o["y"].end].includes(t)||n["a"].options.methods.onKeyDown.call(this,e),this.changeSelectedIndex(t)},onSpaceDown:function(e){},onTabDown:function(e){n["a"].options.methods.onTabDown.call(this,e),this.updateSelf()},onUpDown:function(e){e.preventDefault(),this.activateMenu()},selectItem:function(e){n["a"].options.methods.selectItem.call(this,e),this.setSearch()},setSelectedItems:function(){n["a"].options.methods.setSelectedItems.call(this),this.isFocused||this.setSearch()},setSearch:function(){var e=this;this.$nextTick((function(){e.multiple&&e.internalSearch&&e.isMenuActive||(e.internalSearch=!e.selectedItems.length||e.multiple||e.hasSlot?null:e.getText(e.selectedItem))}))},updateSelf:function(){(this.searchIsDirty||this.internalValue)&&(this.valueComparator(this.internalSearch,this.getValue(this.internalValue))||this.setSearch())},hasItem:function(e){return this.selectedValues.indexOf(this.getValue(e))>-1},onCopy:function(e){var t,a;if(-1!==this.selectedIndex){var s=this.selectedItems[this.selectedIndex],n=this.getText(s);null==(t=e.clipboardData)||t.setData("text/plain",n),null==(a=e.clipboardData)||a.setData("text/vnd.vuetify.autocomplete.item+plain",n),e.preventDefault()}}}})},ca71:function(e,t,a){},e3bc:function(e,t,a){"use strict";a.r(t);var s=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",[a("v-breadcrumbs",{staticClass:"breadcrumbsmain",attrs:{"data-aos":"fade-right",dark:"dark"==e.$store.state.theme,items:e.itemsbr,divider:">",large:""}}),a("v-data-table",{staticClass:"rounded-xl elevation-6 mx-3 pa-1",attrs:{"data-aos":"fade-up","data-aos-delay":"200",headers:e.headers,items:e.dataobject,search:e.search,loading:e.loadtable,"footer-props":{itemsPerPageText:"Jumlah Data Per Halaman",itemsPerPageOptions:[10,25,40,-1],showCurrentPage:!0,showFirstLastPage:!0},"loading-text":"Loading... Please wait"},on:{"update:page":function(t){return e.page=t},"update:items-per-page":function(t){return e.itemsPerPage=t}},scopedSlots:e._u([{key:"top",fn:function(){return[a("v-toolbar",{staticClass:"rounded-xl",attrs:{flat:""}},[a("v-text-field",{staticStyle:{"max-width":"350px"},attrs:{"append-icon":"mdi-magnify",label:"Pencarian",placeholder:"Pencarian...","hide-details":"",dense:"",rounded:"",outlined:"",color:"green"},model:{value:e.search,callback:function(t){e.search=t},expression:"search"}}),a("v-divider",{staticClass:"ml-2"}),a("v-dialog",{attrs:{"max-width":"600px","content-class":"rounded-xl",scrollable:""},model:{value:e.dialog,callback:function(t){e.dialog=t},expression:"dialog"}},[a("v-card",[a("v-card-title",{staticClass:"mb-1 headermodalstyle"},[a("span",{staticClass:"headline"},[e._v("Edit Data")])]),a("v-card-text",[a("v-container",[a("v-row",[a("v-col",{attrs:{cols:"12",sm:"4",md:"4"}},[a("div",[a("h5",[e._v("ID Karyawan")]),a("h2",{staticClass:"ml-2"},[e._v(e._s(e.defaultItem.IdEmp))])])]),a("v-col",{attrs:{cols:"12",sm:"8",md:"8"}},[a("div",[a("h5",[e._v("Nama")]),a("h2",{staticClass:"ml-2"},[e._v(e._s(e.defaultItem.NamaEmp))])])])],1),a("v-row",{staticClass:"mt-5"},[a("v-col",{attrs:{cols:"12",sm:"12",md:"12"}},[a("v-autocomplete",{attrs:{rounded:"",color:"green","item-color":"success","menu-props":{rounded:"xl",transition:"slide-y-transition"},outlined:"","hide-details":"",dense:"",items:e.itemsEmp,"item-value":"nik","item-text":"name",label:"Pilih Manager",clearable:""},on:{change:function(t){return e.selectedManager(t)}},model:{value:e.defaultItem.IdManager,callback:function(t){e.$set(e.defaultItem,"IdManager",t)},expression:"defaultItem.IdManager"}})],1),a("v-col",{attrs:{cols:"12",sm:"12",md:"12"}},[a("v-autocomplete",{attrs:{rounded:"",color:"green","item-color":"success","menu-props":{rounded:"xl",transition:"slide-y-transition"},outlined:"","hide-details":"",dense:"",items:e.itemsMenu,"item-value":"id","item-text":"name",label:"Pilih Tambah Akses Menu"},on:{change:function(t){return e.selectedMenuAccess(t)}},model:{value:e.menudropdown,callback:function(t){e.menudropdown=t},expression:"menudropdown"}})],1)],1),a("v-row",[a("v-col",{attrs:{cols:"12",sm:"12",md:"12"}},[a("v-data-table",{staticClass:"elevation-1 rounded-xl",attrs:{headers:e.headersmenu,items:e.defaultItem.MenuTable,"append-icon":"mdi-magnify","footer-props":{itemsPerPageText:"Jumlah Data Per Halaman",itemsPerPageOptions:[5,10,25,40,-1],showCurrentPage:!0,showFirstLastPage:!0}},scopedSlots:e._u([{key:"item.actions",fn:function(t){var s=t.item;return[a("v-icon",{attrs:{color:"red"},on:{click:function(t){return e.deletelistmenu(s)}}},[e._v(" mdi-delete ")])]}}])})],1)],1)],1)],1),a("v-card-actions",[a("v-spacer"),a("v-btn",{attrs:{color:"red",text:"",rounded:""},on:{click:e.close}},[a("v-icon",{staticClass:"mr-1"},[e._v("mdi-close-circle")]),e._v(" Keluar ")],1),a("v-btn",{attrs:{color:"green white--text",rounded:""},on:{click:e.save}},[a("v-icon",{staticClass:"mr-1"},[e._v("mdi-content-save")]),e._v(" Simpan ")],1)],1)],1)],1)],1)]},proxy:!0},{key:"item.no",fn:function(t){var a=t.index;return[e._v(" "+e._s(e.itemsPerPage*(e.page-1)+a+1)+" ")]}},{key:"item.Menu",fn:function(t){var s=t.item;return[s.Menu.split(", ").length==e.itemsMenu.length?a("v-chip",{staticClass:"pl-2",attrs:{color:"green white--text",rounded:""}},[a("v-icon",{staticClass:"mr-1"},[e._v("mdi-shield-crown")]),e._v(" Semua Akses")],1):s.Menu?s.Menu.split(", ").length<=3?a("div",e._l(s.Menu.split(", "),(function(t,s){return a("v-chip",{key:t+s,staticClass:"pl-1 mr-1",attrs:{color:"green white--text"}},[a("v-icon",{staticClass:"mr-1"},[e._v("mdi-numeric-"+e._s(s+1)+"-circle")]),e._v(" "+e._s(t))],1)})),1):a("div",[a("v-menu",{attrs:{"content-class":"rounded-xl","max-height":"400","offset-y":""},scopedSlots:e._u([{key:"activator",fn:function(t){var n=t.on,i=t.attrs;return[a("v-chip",e._g(e._b({attrs:{color:"green white--text"}},"v-chip",i,!1),n),[a("v-icon",{staticClass:"mr-1"},[e._v("mdi-format-list-numbered")]),e._v(" "+e._s(s.Menu.split(", ").length)+" Akses "),a("v-icon",[e._v("mdi-chevron-down")])],1)]}}],null,!0)},[a("v-card",{attrs:{scrollable:""}},[a("v-card-text",[a("v-simple-table",e._l(s.Menu.split(", ").sort(),(function(t,s){return a("tr",{key:s},[a("td",{staticClass:"text-center"},[e._v(e._s(s+1)+".")]),a("td",[e._v(e._s(t))])])})),0)],1)],1)],1)],1):a("v-chip",{staticClass:"pl-1",attrs:{color:"red white--text",rounded:""}},[a("v-icon",{staticClass:"mr-1"},[e._v("mdi-close-circle")]),e._v(" Tidak Ada Akses")],1)]}},{key:"item.actions",fn:function(t){var s=t.item;return[a("v-icon",{staticClass:"mr-2",attrs:{color:"warning"},on:{click:function(t){return e.editItem(s)}}},[e._v(" mdi-pencil ")])]}}])}),a("v-snackbar",{attrs:{color:e.colorsnackbar,timeout:e.timeoutsnackbar},model:{value:e.snackbar,callback:function(t){e.snackbar=t},expression:"snackbar"}},[e._v(" "+e._s(e.textsnackbar)+" ")])],1)},n=[],i=a("1da1"),r=(a("b0c0"),a("a434"),a("96cf"),a("bc3a")),o=a.n(r),l={name:"Employee",data:function(){return{page:1,itemsPerPage:10,itemsbr:[{text:"Employee",disabled:!0,href:"breadcrumbs_dashboard"},{text:"Employee Menu",disabled:!0,href:"breadcrumbs_link_1"}],value:"add",dialog:!1,loadtable:!1,search:"",authtoken:"",BaseUrlGet:"",headers:[{text:"No",value:"no",width:"70"},{text:"Nama Emp",value:"NamaEmp",width:"20%"},{text:"Nama Manager",value:"NamaManager",width:"20%"},{text:"Akses Menu",value:"Menu"},{text:"Actions",value:"actions",sortable:!1,align:"right"}],headersmenu:[{text:"Menu Code",value:"MenuCode"},{text:"Nama Menu",value:"MenuName"},{text:"Actions",value:"actions",sortable:!1,align:"right"}],defaultItem:{IdEmp:"",NamaEmp:"",Menu:"",IdManager:"",NamaManager:"",MenuCode:[],MenuTable:[]},dataobject:[],itemsEmp:[],itemsMenu:[],statusAdd:!0,snackbar:!1,textsnackbar:"Test",timeoutsnackbar:2e3,colorsnackbar:null,menudropdown:"",editedIndex:-1,editedItem:{MenuCode:"",MenuName:""}}},created:function(){this.authtoken=localStorage.getItem("token"),this.User=JSON.parse(localStorage.getItem("User")),this.BaseUrlGet=localStorage.getItem("BaseUrlGet"),this.BaseUrl=localStorage.getItem("BaseUrl"),this.initialize(),this.GetEmp(),this.GetMenu()},methods:{initialize:function(){var e=this;return Object(i["a"])(regeneratorRuntime.mark((function t(){var a;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return e.loadtable=!0,t.prev=1,t.next=4,o.a.get(e.BaseUrlGet+"GetEmployeeMenuAccess",{headers:{Authorization:"Bearer "+e.authtoken}});case 4:a=t.sent,0!=a.data.length?(e.dataobject=a.data.data.result.data,e.loadtable=!1):(e.dataobject=[],e.loadtable=!1),t.next=12;break;case 8:t.prev=8,t.t0=t["catch"](1),console.error(t.t0),401==t.t0.response.status?(e.loadtable=!1,localStorage.removeItem("token"),e.$router.push("/")):(e.dataobject=[],e.loadtable=!1);case 12:case"end":return t.stop()}}),t,null,[[1,8]])})))()},GetEmp:function(){var e=this;return Object(i["a"])(regeneratorRuntime.mark((function t(){var a;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,o.a.get(e.BaseUrlGet+"GetEmployeeAll",{headers:{Authorization:"Bearer "+e.authtoken}});case 3:a=t.sent,console.log(a.data.data.result.data),0!=a.data.length?e.itemsEmp=a.data.data.result.data.sort((function(e,t){return e.name.localeCompare(t.name)})):(console.log("Kosong"),e.itemsEmp=[]),t.next=12;break;case 8:t.prev=8,t.t0=t["catch"](0),console.error(t.t0),401==t.t0.response.status?(e.alerttoken=!0,localStorage.removeItem("token"),e.$router.push("/")):e.itemsEmp=[];case 12:case"end":return t.stop()}}),t,null,[[0,8]])})))()},GetMenu:function(){var e=this;return Object(i["a"])(regeneratorRuntime.mark((function t(){var a;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,o.a.get(e.BaseUrlGet+"GetAllMenuAccess",{headers:{Authorization:"Bearer "+e.authtoken}});case 3:a=t.sent,console.log(a.data.data.result),0!=a.data.length?e.itemsMenu=a.data.data.result.sort((function(e,t){return e.name.localeCompare(t.name)})):(console.log("Kosong"),e.itemsEmp=[]),t.next=12;break;case 8:t.prev=8,t.t0=t["catch"](0),console.error(t.t0),401==t.t0.response.status?(e.alerttoken=!0,localStorage.removeItem("token"),e.$router.push("/")):e.itemsEmp=[];case 12:case"end":return t.stop()}}),t,null,[[0,8]])})))()},Update:function(e){var t=this;return Object(i["a"])(regeneratorRuntime.mark((function a(){var s;return regeneratorRuntime.wrap((function(a){while(1)switch(a.prev=a.next){case 0:return console.log(e),a.prev=1,a.next=4,o.a.post(t.BaseUrlGet+"EditMenuAccessEmp",e,{headers:{Authorization:"Bearer "+t.authtoken}});case 4:s=a.sent,console.log(s.data.data.result),"success"==s.data.data.result?(t.dialog=!1,t.snackbar=!0,t.colorsnackbar="green",t.textsnackbar="Sukses mengubah data",t.initialize()):(t.dialog=!0,t.snackbar=!0,t.colorsnackbar="red",t.textsnackbar="Gagal mengubah data"),a.next=13;break;case 9:a.prev=9,a.t0=a["catch"](1),console.error(a.t0.response),401==a.t0.response.status?(t.dialog=!0,t.snackbar=!0,t.colorsnackbar="red",t.textsnackbar="Gagal mengubah data",localStorage.removeItem("token"),t.$router.push("/")):(t.dialog=!0,t.snackbar=!0,t.colorsnackbar="red",t.textsnackbar="Gagal mengubah data");case 13:return a.prev=13,t.menudropdown="",a.finish(13);case 16:case"end":return a.stop()}}),a,null,[[1,9,13,16]])})))()},editItem:function(e){console.log(e),this.defaultItem.IdEmp=e.IdEmp,this.defaultItem.NamaEmp=e.NamaEmp,this.defaultItem.Menu=e.Menu,this.defaultItem.IdManager=e.IdManager,this.defaultItem.NamaManager=e.NamaManager,this.defaultItem.MenuCode=e.MenuCode,this.defaultItem.MenuTable=e.MenuTable,this.statusAdd=!1,this.dialog=!0},selectedManager:function(e){if(console.log(e),null!=e){for(var t=0;t<this.itemsMenu.length;t++)if(this.itemsEmp[t].nik==e){this.defaultItem.IdManager=this.itemsEmp[t].nik,this.defaultItem.NamaManager=this.itemsEmp[t].name;break}}else this.defaultItem.IdManager="-",this.defaultItem.NamaManager="-"},selectedMenuAccess:function(e){if(null!=e){for(var t=this.defaultItem.MenuTable,a=!1,s=0;s<t.length;s++)if(t[s].MenuCode==e){a=!0;break}if(0==a){for(var n={MenuCode:"",MenuName:""},i=0;i<this.itemsMenu.length;i++)if(this.itemsMenu[i].id==e){n.MenuCode=this.itemsMenu[i].id,n.MenuName=this.itemsMenu[i].name;break}this.defaultItem.MenuTable.push(n),this.snackbar=!0,this.colorsnackbar="green",this.textsnackbar="Sukses Tambah Menu Access"}else this.snackbar=!0,this.colorsnackbar="red",this.textsnackbar="Menu Sudah Ada Bro..!!!"}},deletelistmenu:function(e){var t=this;return Object(i["a"])(regeneratorRuntime.mark((function a(){return regeneratorRuntime.wrap((function(a){while(1)switch(a.prev=a.next){case 0:return console.log(e),a.next=3,t.defaultItem.MenuTable.indexOf(e);case 3:return t.editedIndex=a.sent,a.next=6,Object.assign({},e);case 6:t.editedItem=a.sent,t.defaultItem.MenuTable.splice(t.editedIndex,1);case 8:case"end":return a.stop()}}),a)})))()},save:function(){if(0!=this.defaultItem.IdEmp.length){for(var e="",t="",a=0;a<this.defaultItem.MenuTable.length;a++)t=0==a?this.defaultItem.MenuTable[a].MenuCode:t+","+this.defaultItem.MenuTable[a].MenuCode;e="["+t+"]",console.log(e);var s={nik:this.defaultItem.IdEmp,manager_code:this.defaultItem.IdManager,menu_access:e,NamaEmp:this.defaultItem.NamaEmp,NamaManager:this.defaultItem.NamaManager,MenuTable:this.defaultItem.MenuTable};console.log(s),0==this.statusAdd&&this.Update(s)}else this.snackbar=!0,this.colorsnackbar="red",this.textsnackbar="Gagal Simpan, Semua kolom tidak boleh ada yang kosong"},close:function(){this.dialog=!1}}},c=l,u=a("2877"),d=a("6544"),h=a.n(d),m=a("c6a6"),p=a("2bc5"),f=a("8336"),v=a("b0af"),g=a("99d9"),b=a("cc20"),I=a("62ad"),k=a("a523"),x=a("8fea"),M=a("169a"),S=a("ce7e"),y=a("132d"),C=a("e449"),w=a("0fd9"),_=a("1f4f"),T=a("2db4"),O=a("2fa4"),j=a("8654"),E=a("71d9"),A=Object(u["a"])(c,s,n,!1,null,null,null);t["default"]=A.exports;h()(A,{VAutocomplete:m["a"],VBreadcrumbs:p["a"],VBtn:f["a"],VCard:v["a"],VCardActions:g["a"],VCardText:g["c"],VCardTitle:g["d"],VChip:b["a"],VCol:I["a"],VContainer:k["a"],VDataTable:x["a"],VDialog:M["a"],VDivider:S["a"],VIcon:y["a"],VMenu:C["a"],VRow:w["a"],VSimpleTable:_["a"],VSnackbar:T["a"],VSpacer:O["a"],VTextField:j["a"],VToolbar:E["a"]})}}]);
//# sourceMappingURL=chunk-04cde886.b339c3af.js.map