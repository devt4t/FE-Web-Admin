(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-0f0edfca"],{"169a":function(t,e,i){"use strict";var n=i("5530"),a=i("2909"),s=i("ade3"),r=(i("a9e3"),i("498a"),i("caad"),i("2532"),i("7db0"),i("368e"),i("480e")),o=i("4ad4"),c=i("b848"),l=i("75eb"),d=i("e707"),h=i("e4d3"),u=i("21be"),v=i("f2e7"),f=i("a293"),g=i("58df"),m=i("d9bd"),p=i("80d2"),b=Object(g["a"])(o["a"],c["a"],l["a"],d["a"],h["a"],u["a"],v["a"]);e["a"]=b.extend({name:"v-dialog",directives:{ClickOutside:f["a"]},props:{dark:Boolean,disabled:Boolean,fullscreen:Boolean,light:Boolean,maxWidth:{type:[String,Number],default:"none"},noClickAnimation:Boolean,origin:{type:String,default:"center center"},persistent:Boolean,retainFocus:{type:Boolean,default:!0},scrollable:Boolean,transition:{type:[String,Boolean],default:"dialog-transition"},width:{type:[String,Number],default:"auto"}},data:function(){return{activatedBy:null,animate:!1,animateTimeout:-1,isActive:!!this.value,stackMinZIndex:200,previousActiveElement:null}},computed:{classes:function(){var t;return t={},Object(s["a"])(t,"v-dialog ".concat(this.contentClass).trim(),!0),Object(s["a"])(t,"v-dialog--active",this.isActive),Object(s["a"])(t,"v-dialog--persistent",this.persistent),Object(s["a"])(t,"v-dialog--fullscreen",this.fullscreen),Object(s["a"])(t,"v-dialog--scrollable",this.scrollable),Object(s["a"])(t,"v-dialog--animated",this.animate),t},contentClasses:function(){return{"v-dialog__content":!0,"v-dialog__content--active":this.isActive}},hasActivator:function(){return Boolean(!!this.$slots.activator||!!this.$scopedSlots.activator)}},watch:{isActive:function(t){var e;t?(this.show(),this.hideScroll()):(this.removeOverlay(),this.unbind(),null==(e=this.previousActiveElement)||e.focus())},fullscreen:function(t){this.isActive&&(t?(this.hideScroll(),this.removeOverlay(!1)):(this.showScroll(),this.genOverlay()))}},created:function(){this.$attrs.hasOwnProperty("full-width")&&Object(m["e"])("full-width",this)},beforeMount:function(){var t=this;this.$nextTick((function(){t.isBooted=t.isActive,t.isActive&&t.show()}))},beforeDestroy:function(){"undefined"!==typeof window&&this.unbind()},methods:{animateClick:function(){var t=this;this.animate=!1,this.$nextTick((function(){t.animate=!0,window.clearTimeout(t.animateTimeout),t.animateTimeout=window.setTimeout((function(){return t.animate=!1}),150)}))},closeConditional:function(t){var e=t.target;return!(this._isDestroyed||!this.isActive||this.$refs.content.contains(e)||this.overlay&&e&&!this.overlay.$el.contains(e))&&this.activeZIndex>=this.getMaxZIndex()},hideScroll:function(){this.fullscreen?document.documentElement.classList.add("overflow-y-hidden"):d["a"].options.methods.hideScroll.call(this)},show:function(){var t=this;!this.fullscreen&&!this.hideOverlay&&this.genOverlay(),this.$nextTick((function(){t.$nextTick((function(){t.previousActiveElement=document.activeElement,t.$refs.content.focus(),t.bind()}))}))},bind:function(){window.addEventListener("focusin",this.onFocusin)},unbind:function(){window.removeEventListener("focusin",this.onFocusin)},onClickOutside:function(t){this.$emit("click:outside",t),this.persistent?this.noClickAnimation||this.animateClick():this.isActive=!1},onKeydown:function(t){if(t.keyCode===p["y"].esc&&!this.getOpenDependents().length)if(this.persistent)this.noClickAnimation||this.animateClick();else{this.isActive=!1;var e=this.getActivator();this.$nextTick((function(){return e&&e.focus()}))}this.$emit("keydown",t)},onFocusin:function(t){if(t&&this.retainFocus){var e=t.target;if(e&&![document,this.$refs.content].includes(e)&&!this.$refs.content.contains(e)&&this.activeZIndex>=this.getMaxZIndex()&&!this.getOpenDependentElements().some((function(t){return t.contains(e)}))){var i=this.$refs.content.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'),n=Object(a["a"])(i).find((function(t){return!t.hasAttribute("disabled")}));n&&n.focus()}}},genContent:function(){var t=this;return this.showLazyContent((function(){return[t.$createElement(r["a"],{props:{root:!0,light:t.light,dark:t.dark}},[t.$createElement("div",{class:t.contentClasses,attrs:Object(n["a"])({role:"document",tabindex:t.isActive?0:void 0},t.getScopeIdAttrs()),on:{keydown:t.onKeydown},style:{zIndex:t.activeZIndex},ref:"content"},[t.genTransition()])])]}))},genTransition:function(){var t=this.genInnerContent();return this.transition?this.$createElement("transition",{props:{name:this.transition,origin:this.origin,appear:!0}},[t]):t},genInnerContent:function(){var t={class:this.classes,ref:"dialog",directives:[{name:"click-outside",value:{handler:this.onClickOutside,closeConditional:this.closeConditional,include:this.getOpenDependentElements}},{name:"show",value:this.isActive}],style:{transformOrigin:this.origin}};return this.fullscreen||(t.style=Object(n["a"])(Object(n["a"])({},t.style),{},{maxWidth:"none"===this.maxWidth?void 0:Object(p["g"])(this.maxWidth),width:"auto"===this.width?void 0:Object(p["g"])(this.width)})),this.$createElement("div",t,this.getContentSlot())}},render:function(t){return t("div",{staticClass:"v-dialog__container",class:{"v-dialog__container--attached":""===this.attach||!0===this.attach||"attach"===this.attach},attrs:{role:"dialog"}},[this.genActivator(),this.genContent()])}})},"297c":function(t,e,i){"use strict";i("a9e3");var n=i("2b0e"),a=i("37c6");e["a"]=n["default"].extend().extend({name:"loadable",props:{loading:{type:[Boolean,String],default:!1},loaderHeight:{type:[Number,String],default:2}},methods:{genProgress:function(){return!1===this.loading?null:this.$slots.progress||this.$createElement(a["a"],{props:{absolute:!0,color:!0===this.loading||""===this.loading?this.color||"primary":this.loading,height:this.loaderHeight,indeterminate:!0}})}}})},"2ba1":function(t,e,i){"use strict";i.r(e);var n=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("v-dialog",{attrs:{"content-class":"rounded-xl mx-1","max-width":"1200px",scrollable:"",persistent:""},model:{value:t.showModal,callback:function(e){t.showModal=e},expression:"showModal"}},[i("v-card",[i("v-card-title",{staticClass:"mb-1 headermodalstyle rounded-xl"},[i("span",{staticClass:"white--text"},[i("v-btn",{staticClass:"white dark--text mr-1",attrs:{fab:"","x-small":""}},[i("v-icon",{attrs:{color:"grey darken-3"}},[t._v("mdi-file-account")])],1),t._v(" Export Excel Preview")],1),i("v-icon",{staticClass:"ml-auto",attrs:{color:"red lighten-1"},on:{click:function(e){t.showModal=!1}}},[t._v("mdi-close-circle")])],1),i("v-card-text",[i("v-overlay",{attrs:{absolute:"",value:t.loading.show}},[i("div",{staticClass:"d-flex flex-column justify-center align-center"},[i("LottieAnimation",{ref:"anim",staticStyle:{height:"64px"},attrs:{animationData:t.lottie.data.loading,loop:!0}}),i("p",{staticClass:"mt-2 mb-0"},[t._v(t._s(t.loading.text)+" "),i("v-progress-circular",{attrs:{size:17,width:3,indeterminate:"",color:"white"}})],1)],1)]),i("table",{staticStyle:{"border-collapse":"collapse","min-height":"400px"},attrs:{id:"tableForExport"}},[i("thead",[i("tr",[i("th",{staticStyle:{"text-align":"left"},attrs:{colspan:"8"}},[t._v(t._s(t.download.title))])]),i("tr",[i("td",{staticStyle:{"text-align":"left"},attrs:{colspan:"8"}},[t._v("Export Time: "+t._s(Date()))])]),i("tr",[i("td",{staticStyle:{"text-align":"left"},attrs:{colspan:"8"}},[t._v("Total Lahan: "+t._s(t.table.data.length))])]),i("tr"),i("tr",[i("th",[t._v("No")]),i("th",[t._v("MU")]),i("th",[t._v("TA")]),i("th",[t._v("Desa")]),i("th",[t._v("Nama Petani")]),i("th",[t._v("No Lahan")]),i("th",[t._v("No SPPT")]),i("th",[t._v("Tahun Tanam")]),i("th",[t._v("Monitoring No")]),t._l(t.table.trees,(function(e){return i("th",{key:"trees-header-"+e.tree_code},[t._v(t._s(e.tree_name))])}))],2)]),i("tbody",t._l(t.table.data,(function(e,n){return i("tr",{key:"table-row-"+n},[i("td",[t._v(t._s(n+1))]),i("td",[t._v(t._s(e.mu_name))]),i("td",[t._v(t._s(e.ta_name))]),i("td",[t._v(t._s(e.village_name))]),i("td",[t._v(t._s(e.farmer_name))]),i("td",[t._v(t._s(e.lahan_no))]),i("td",[t._v(t._s(e.document_no))]),i("td",[t._v(t._s(e.program_year))]),i("td",[t._v(t._s(e.monitoring_no))]),t._l(t.table.trees,(function(n){return i("td",{key:"trees-column-"+n.tree_code},[t._v(t._s(e[n.tree_code]||0))])}))],2)})),0)])],1),i("v-card-actions",[i("v-divider",{staticClass:"mr-2"}),i("v-btn",{attrs:{color:"blue white--text",rounded:""},on:{click:function(){return t.downloadExcel()}}},[i("v-icon",[t._v("mdi-download")]),t._v(" Download")],1),i("v-divider",{staticClass:"ml-2"})],1)],1)],1)},a=[],s=i("2909"),r=i("1da1"),o=(i("96cf"),i("99af"),i("d81d"),i("bc3a")),c=i.n(o),l=i("86e6"),d=i("1d71"),h={components:{LottieAnimation:l["a"]},props:{show:{type:Boolean,default:!1},data:{type:Array,default:[]}},data:function(){return{download:{title:"Export LAHAN 2021 & 2022 (SPPT Required & Plants)"},loading:{show:!1,text:""},lottie:{data:{loading:d}},table:{data:[],trees:[]}}},computed:{showModal:{get:function(){return this.show&&this.getTableData(),this.show},set:function(t){0==t&&this.$emit("close")}}},watch:{"table.data":{handler:function(t){console.log(t)}}},mounted:function(){},methods:{downloadExcel:function(){var t=document.getElementById("tableForExport"),e=XLSX.utils.table_to_book(t);XLSX.writeFile(e,"".concat(this.download.title,".xlsx"))},getTableData:function(){var t=this;return Object(r["a"])(regeneratorRuntime.mark((function e(){var i,n,a,r,o,l,d,h,u,v,f,g;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:e.prev=0,i=t.loading,t.table.data=[],i.show=!0,i.text="Preparing data...",n=["04-0007","04-0015","04-0037","09-00998","04-0050","01-0002"],a=0,r=t.$store,i.text="Getting data UM ".concat(a," / ").concat(n.length,"..."),o=0;case 10:if(!(o<n.length)){e.next=38;break}return l=0,e.next=14,c.a.get(r.getters.getApiUrl("GetEmployeebyManager?position=19&manager_code=".concat(n[o])),r.state.apiConfig);case 14:d=e.sent,h=d.data.data.result.data.map((function(t){return t.nik})),i.text="Done UM ".concat(a," / ").concat(n.length," FC ").concat(l," / ").concat(h.length,"..."),u=0;case 18:if(!(u<h.length)){e.next=30;break}return e.next=21,c.a.get(r.getters.getApiUrl("GetDataLahanByDocumentSPPT?fc_no=".concat(h[u])),r.state.apiConfig);case 21:f=e.sent,g=f.data.data,0===t.table.trees.length&&(t.table.trees=f.data.trees),(v=t.table.data).push.apply(v,Object(s["a"])(g)),l+=1,i.text="Done UM ".concat(a," / ").concat(n.length," FC ").concat(l," / ").concat(h.length,"...");case 27:u++,e.next=18;break;case 30:a+=1,t.download.title=t.download.title+" "+a,t.downloadExcel(),i.text="Done UM ".concat(a," / ").concat(n.length," FC ").concat(l," / ").concat(h.length,"..."),a===n.length&&l===h.length&&(i.show=!1);case 35:o++,e.next=10;break;case 38:console.log(t.table);case 39:return e.prev=39,t.loading.show=!1,e.finish(39);case 42:case"end":return e.stop()}}),e,null,[[0,,39,42]])})))()}}},u=h,v=i("2877"),f=i("6544"),g=i.n(f),m=i("8336"),p=i("b0af"),b=i("99d9"),_=i("169a"),y=i("ce7e"),x=i("132d"),w=i("a797"),C=i("490a"),k=Object(v["a"])(u,n,a,!1,null,null,null);e["default"]=k.exports;g()(k,{VBtn:m["a"],VCard:p["a"],VCardActions:b["a"],VCardText:b["c"],VCardTitle:b["d"],VDialog:_["a"],VDivider:y["a"],VIcon:x["a"],VOverlay:w["a"],VProgressCircular:C["a"]})},"368e":function(t,e,i){},"37c6":function(t,e,i){"use strict";var n=i("5530"),a=i("ade3"),s=(i("a9e3"),i("c7cd"),i("6ece"),i("0789")),r=i("a9ad"),o=i("fe6c"),c=i("a452"),l=i("7560"),d=i("80d2"),h=i("58df"),u=Object(h["a"])(r["a"],Object(o["b"])(["absolute","fixed","top","bottom"]),c["a"],l["a"]),v=u.extend({name:"v-progress-linear",props:{active:{type:Boolean,default:!0},backgroundColor:{type:String,default:null},backgroundOpacity:{type:[Number,String],default:null},bufferValue:{type:[Number,String],default:100},color:{type:String,default:"primary"},height:{type:[Number,String],default:4},indeterminate:Boolean,query:Boolean,reverse:Boolean,rounded:Boolean,stream:Boolean,striped:Boolean,value:{type:[Number,String],default:0}},data:function(){return{internalLazyValue:this.value||0}},computed:{__cachedBackground:function(){return this.$createElement("div",this.setBackgroundColor(this.backgroundColor||this.color,{staticClass:"v-progress-linear__background",style:this.backgroundStyle}))},__cachedBar:function(){return this.$createElement(this.computedTransition,[this.__cachedBarType])},__cachedBarType:function(){return this.indeterminate?this.__cachedIndeterminate:this.__cachedDeterminate},__cachedBuffer:function(){return this.$createElement("div",{staticClass:"v-progress-linear__buffer",style:this.styles})},__cachedDeterminate:function(){return this.$createElement("div",this.setBackgroundColor(this.color,{staticClass:"v-progress-linear__determinate",style:{width:Object(d["g"])(this.normalizedValue,"%")}}))},__cachedIndeterminate:function(){return this.$createElement("div",{staticClass:"v-progress-linear__indeterminate",class:{"v-progress-linear__indeterminate--active":this.active}},[this.genProgressBar("long"),this.genProgressBar("short")])},__cachedStream:function(){return this.stream?this.$createElement("div",this.setTextColor(this.color,{staticClass:"v-progress-linear__stream",style:{width:Object(d["g"])(100-this.normalizedBuffer,"%")}})):null},backgroundStyle:function(){var t,e=null==this.backgroundOpacity?this.backgroundColor?1:.3:parseFloat(this.backgroundOpacity);return t={opacity:e},Object(a["a"])(t,this.isReversed?"right":"left",Object(d["g"])(this.normalizedValue,"%")),Object(a["a"])(t,"width",Object(d["g"])(this.normalizedBuffer-this.normalizedValue,"%")),t},classes:function(){return Object(n["a"])({"v-progress-linear--absolute":this.absolute,"v-progress-linear--fixed":this.fixed,"v-progress-linear--query":this.query,"v-progress-linear--reactive":this.reactive,"v-progress-linear--reverse":this.isReversed,"v-progress-linear--rounded":this.rounded,"v-progress-linear--striped":this.striped},this.themeClasses)},computedTransition:function(){return this.indeterminate?s["d"]:s["e"]},isReversed:function(){return this.$vuetify.rtl!==this.reverse},normalizedBuffer:function(){return this.normalize(this.bufferValue)},normalizedValue:function(){return this.normalize(this.internalLazyValue)},reactive:function(){return Boolean(this.$listeners.change)},styles:function(){var t={};return this.active||(t.height=0),this.indeterminate||100===parseFloat(this.normalizedBuffer)||(t.width=Object(d["g"])(this.normalizedBuffer,"%")),t}},methods:{genContent:function(){var t=Object(d["s"])(this,"default",{value:this.internalLazyValue});return t?this.$createElement("div",{staticClass:"v-progress-linear__content"},t):null},genListeners:function(){var t=this.$listeners;return this.reactive&&(t.click=this.onClick),t},genProgressBar:function(t){return this.$createElement("div",this.setBackgroundColor(this.color,{staticClass:"v-progress-linear__indeterminate",class:Object(a["a"])({},t,!0)}))},onClick:function(t){if(this.reactive){var e=this.$el.getBoundingClientRect(),i=e.width;this.internalValue=t.offsetX/i*100}},normalize:function(t){return t<0?0:t>100?100:parseFloat(t)}},render:function(t){var e={staticClass:"v-progress-linear",attrs:{role:"progressbar","aria-valuemin":0,"aria-valuemax":this.normalizedBuffer,"aria-valuenow":this.indeterminate?void 0:this.normalizedValue},class:this.classes,style:{bottom:this.bottom?0:void 0,height:this.active?Object(d["g"])(this.height):0,top:this.top?0:void 0},on:this.genListeners()};return t("div",e,[this.__cachedStream,this.__cachedBackground,this.__cachedBuffer,this.__cachedBar,this.genContent()])}});e["a"]=v},"615b":function(t,e,i){},"6ece":function(t,e,i){},"8ce9":function(t,e,i){},"99d9":function(t,e,i){"use strict";i.d(e,"a",(function(){return s})),i.d(e,"b",(function(){return r})),i.d(e,"c",(function(){return o})),i.d(e,"d",(function(){return c}));var n=i("b0af"),a=i("80d2"),s=Object(a["i"])("v-card__actions"),r=Object(a["i"])("v-card__subtitle"),o=Object(a["i"])("v-card__text"),c=Object(a["i"])("v-card__title");n["a"]},b0af:function(t,e,i){"use strict";var n=i("5530"),a=(i("a9e3"),i("0481"),i("615b"),i("10d2")),s=i("297c"),r=i("1c87"),o=i("58df");e["a"]=Object(o["a"])(s["a"],r["a"],a["a"]).extend({name:"v-card",props:{flat:Boolean,hover:Boolean,img:String,link:Boolean,loaderHeight:{type:[Number,String],default:4},raised:Boolean},computed:{classes:function(){return Object(n["a"])(Object(n["a"])({"v-card":!0},r["a"].options.computed.classes.call(this)),{},{"v-card--flat":this.flat,"v-card--hover":this.hover,"v-card--link":this.isClickable,"v-card--loading":this.loading,"v-card--disabled":this.disabled,"v-card--raised":this.raised},a["a"].options.computed.classes.call(this))},styles:function(){var t=Object(n["a"])({},a["a"].options.computed.styles.call(this));return this.img&&(t.background='url("'.concat(this.img,'") center center / cover no-repeat')),t}},methods:{genProgress:function(){var t=s["a"].options.methods.genProgress.call(this);return t?this.$createElement("div",{staticClass:"v-card__progress",key:"progress"},[t]):null}},render:function(t){var e=this.generateRouteLink(),i=e.tag,n=e.data;return n.style=this.styles,this.isClickable&&(n.attrs=n.attrs||{},n.attrs.tabindex=0),t(i,this.setBackgroundColor(this.color,n),[this.genProgress(),this.$slots.default])}})},ce7e:function(t,e,i){"use strict";var n=i("5530"),a=(i("8ce9"),i("7560"));e["a"]=a["a"].extend({name:"v-divider",props:{inset:Boolean,vertical:Boolean},render:function(t){var e;return this.$attrs.role&&"separator"!==this.$attrs.role||(e=this.vertical?"vertical":"horizontal"),t("hr",{class:Object(n["a"])({"v-divider":!0,"v-divider--inset":this.inset,"v-divider--vertical":this.vertical},this.themeClasses),attrs:Object(n["a"])({role:"separator","aria-orientation":e},this.$attrs),on:this.$listeners})}})}}]);
//# sourceMappingURL=chunk-0f0edfca.703a671c.js.map