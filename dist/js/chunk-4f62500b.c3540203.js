(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-4f62500b"],{1681:function(t,e,n){},"23a7":function(t,e,n){"use strict";var i=n("2909"),a=n("5530"),s=n("53ca"),o=(n("a9e3"),n("caad"),n("d81d"),n("b0c0"),n("99af"),n("a434"),n("159b"),n("fb6a"),n("5803"),n("2677")),r=n("cc20"),l=n("80d2"),c=n("d9bd"),u=n("d9f7");e["a"]=o["a"].extend({name:"v-file-input",model:{prop:"value",event:"change"},props:{chips:Boolean,clearable:{type:Boolean,default:!0},counterSizeString:{type:String,default:"$vuetify.fileInput.counterSize"},counterString:{type:String,default:"$vuetify.fileInput.counter"},hideInput:Boolean,placeholder:String,prependIcon:{type:String,default:"$file"},readonly:{type:Boolean,default:!1},showSize:{type:[Boolean,Number],default:!1,validator:function(t){return"boolean"===typeof t||[1e3,1024].includes(t)}},smallChips:Boolean,truncateLength:{type:[Number,String],default:22},type:{type:String,default:"file"},value:{default:void 0,validator:function(t){return Object(l["H"])(t).every((function(t){return null!=t&&"object"===Object(s["a"])(t)}))}}},computed:{classes:function(){return Object(a["a"])(Object(a["a"])({},o["a"].options.computed.classes.call(this)),{},{"v-file-input":!0})},computedCounterValue:function(){var t=this.isMultiple&&this.lazyValue?this.lazyValue.length:this.lazyValue instanceof File?1:0;if(!this.showSize)return this.$vuetify.lang.t(this.counterString,t);var e=this.internalArrayValue.reduce((function(t,e){var n=e.size,i=void 0===n?0:n;return t+i}),0);return this.$vuetify.lang.t(this.counterSizeString,t,Object(l["w"])(e,1024===this.base))},internalArrayValue:function(){return Object(l["H"])(this.internalValue)},internalValue:{get:function(){return this.lazyValue},set:function(t){this.lazyValue=t,this.$emit("change",this.lazyValue)}},isDirty:function(){return this.internalArrayValue.length>0},isLabelActive:function(){return this.isDirty},isMultiple:function(){return this.$attrs.hasOwnProperty("multiple")},text:function(){var t=this;return this.isDirty||!this.isFocused&&this.hasLabel?this.internalArrayValue.map((function(e){var n=e.name,i=void 0===n?"":n,a=e.size,s=void 0===a?0:a,o=t.truncateText(i);return t.showSize?"".concat(o," (").concat(Object(l["w"])(s,1024===t.base),")"):o})):[this.placeholder]},base:function(){return"boolean"!==typeof this.showSize?this.showSize:void 0},hasChips:function(){return this.chips||this.smallChips}},watch:{readonly:{handler:function(t){!0===t&&Object(c["b"])("readonly is not supported on <v-file-input>",this)},immediate:!0},value:function(t){var e=this.isMultiple?t:t?[t]:[];Object(l["j"])(e,this.$refs.input.files)||(this.$refs.input.value="")}},methods:{clearableCallback:function(){this.internalValue=this.isMultiple?[]:null,this.$refs.input.value=""},genChips:function(){var t=this;return this.isDirty?this.text.map((function(e,n){return t.$createElement(r["a"],{props:{small:t.smallChips},on:{"click:close":function(){var e=t.internalValue;e.splice(n,1),t.internalValue=e}}},[e])})):[]},genControl:function(){var t=o["a"].options.methods.genControl.call(this);return this.hideInput&&(t.data.style=Object(u["d"])(t.data.style,{display:"none"})),t},genInput:function(){var t=o["a"].options.methods.genInput.call(this);return delete t.data.domProps.value,delete t.data.on.input,t.data.on.change=this.onInput,[this.genSelections(),t]},genPrependSlot:function(){var t=this;if(!this.prependIcon)return null;var e=this.genIcon("prepend",(function(){t.$refs.input.click()}));return this.genSlot("prepend","outer",[e])},genSelectionText:function(){var t=this.text.length;return t<2?this.text:this.showSize&&!this.counter?[this.computedCounterValue]:[this.$vuetify.lang.t(this.counterString,t)]},genSelections:function(){var t=this,e=[];return this.isDirty&&this.$scopedSlots.selection?this.internalArrayValue.forEach((function(n,i){t.$scopedSlots.selection&&e.push(t.$scopedSlots.selection({text:t.text[i],file:n,index:i}))})):e.push(this.hasChips&&this.isDirty?this.genChips():this.genSelectionText()),this.$createElement("div",{staticClass:"v-file-input__text",class:{"v-file-input__text--placeholder":this.placeholder&&!this.isDirty,"v-file-input__text--chips":this.hasChips&&!this.$scopedSlots.selection}},e)},genTextFieldSlot:function(){var t=this,e=o["a"].options.methods.genTextFieldSlot.call(this);return e.data.on=Object(a["a"])(Object(a["a"])({},e.data.on||{}),{},{click:function(){return t.$refs.input.click()}}),e},onInput:function(t){var e=Object(i["a"])(t.target.files||[]);this.internalValue=this.isMultiple?e:e[0],this.initialValue=this.internalValue},onKeyDown:function(t){this.$emit("keydown",t)},truncateText:function(t){if(t.length<Number(this.truncateLength))return t;var e=Math.floor((Number(this.truncateLength)-1)/2);return"".concat(t.slice(0,e),"…").concat(t.slice(t.length-e))}}})},2677:function(t,e,n){"use strict";var i=n("8654");e["a"]=i["a"]},5803:function(t,e,n){},a844:function(t,e,n){"use strict";var i=n("5530"),a=(n("a9e3"),n("1681"),n("8654")),s=n("58df"),o=Object(s["a"])(a["a"]);e["a"]=o.extend({name:"v-textarea",props:{autoGrow:Boolean,noResize:Boolean,rowHeight:{type:[Number,String],default:24,validator:function(t){return!isNaN(parseFloat(t))}},rows:{type:[Number,String],default:5,validator:function(t){return!isNaN(parseInt(t,10))}}},computed:{classes:function(){return Object(i["a"])({"v-textarea":!0,"v-textarea--auto-grow":this.autoGrow,"v-textarea--no-resize":this.noResizeHandle},a["a"].options.computed.classes.call(this))},noResizeHandle:function(){return this.noResize||this.autoGrow}},watch:{lazyValue:function(){this.autoGrow&&this.$nextTick(this.calculateInputHeight)},rowHeight:function(){this.autoGrow&&this.$nextTick(this.calculateInputHeight)}},mounted:function(){var t=this;setTimeout((function(){t.autoGrow&&t.calculateInputHeight()}),0)},methods:{calculateInputHeight:function(){var t=this.$refs.input;if(t){t.style.height="0";var e=t.scrollHeight,n=parseInt(this.rows,10)*parseFloat(this.rowHeight);t.style.height=Math.max(n,e)+"px"}},genInput:function(){var t=a["a"].options.methods.genInput.call(this);return t.tag="textarea",delete t.data.attrs.type,t.data.attrs.rows=this.rows,t},onInput:function(t){a["a"].options.methods.onInput.call(this,t),this.autoGrow&&this.calculateInputHeight()},onKeyDown:function(t){this.isFocused&&13===t.keyCode&&t.stopPropagation(),this.$emit("keydown",t)}}})},c7b2:function(t,e,n){"use strict";n.r(e);var i=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("v-dialog",{attrs:{"content-class":"rounded-xl mx-1","max-width":"800px",scrollable:"",persistent:""},model:{value:t.showModal,callback:function(e){t.showModal=e},expression:"showModal"}},[n("v-card",[n("v-card-title",{staticClass:"mb-1 grey darken-3 rounded-xl"},[n("span",{staticClass:"white--text"},[n("v-btn",{staticClass:"white dark--text mr-1",attrs:{fab:"","x-small":""}},[n("v-icon",{attrs:{color:"grey darken-3"}},[t._v("mdi-card-account-details")])],1),t._v(" Driver Form")],1),n("v-icon",{staticClass:"ml-auto",attrs:{color:"red lighten-1"},on:{click:function(e){t.showModal=!1}}},[t._v("mdi-close-circle")])],1),n("v-card-text",[n("v-overlay",{attrs:{absolute:"",value:t.loading.show}},[n("div",{staticClass:"d-flex flex-column"}),n("v-progress-circular",{attrs:{size:80,width:10,indeterminate:"",color:"green"}}),n("p",{staticClass:"mt-2 mb-0"},[t._v(t._s(t.loading.text))])],1),n("v-row",{staticClass:"mt-0"},[n("v-col",{attrs:{cols:"12",sm:"12",md:"6",lg:"4"}},[n("v-autocomplete",{attrs:{color:"success","hide-details":"","item-color":"success","item-text":"name","item-value":"nik",dense:"",items:t.$store.state.programYear.options,disabled:!0,label:"Program Year","menu-props":{rounded:"xl",transition:"slide-y-transition"},outlined:"",rounded:"",rules:[function(t){return!!t||"Field is required"}]},model:{value:t.inputs.program_year.model,callback:function(e){t.$set(t.inputs.program_year,"model",e)},expression:"inputs.program_year.model"}})],1)],1),n("div",{staticClass:"pb-2 d-flex align-center mt-4"},[n("p",{staticClass:"mb-0"},[n("v-icon",{staticClass:"mr-2"},[t._v("mdi-id-card")]),t._v("Biodata")],1),n("v-divider",{staticClass:"mx-2"})],1),n("v-row",[n("v-col",{attrs:{cols:"12",sm:"12",md:"12"}},[n("v-alert",{staticClass:"rounded-xl",attrs:{value:t.inputs.nik.exist,type:"error",dense:"",dismissible:"",transition:"scale-transition"}},[t._v(" The nik has already been taken. ")]),t.inputs.nik.model&&0==t.inputs.nik.exist&&0==t.checkNik.loading&&1==t.checkNik.checked?n("v-alert",{staticClass:"rounded-xl",attrs:{type:"success",dense:"",dismissible:"","data-aos":"zoom-in","data-aos-duration":"100"}},[t._v(" The nik is available. ")]):t._e(),n("v-row",{staticClass:"ma-0 align-center"},[n("v-text-field",{ref:"nikInput",class:(t.inputs.nik.model?t.inputs.nik.exist?"red--text":"green-text":"")+" mt-2",attrs:{dense:"",color:"success","hide-details":"",label:t.inputs.nik.label,loading:t.inputs.nik.loading,"no-data-text":t.inputs.nik.loading?"Loading...":"No Data",outlined:"","append-icon":(t.inputs.nik.exist||t.inputs.nik.model,""),rounded:"",rules:[function(t){return 16==t.length||"Field is required"}],disabled:!!t.id},model:{value:t.inputs.nik.model,callback:function(e){t.$set(t.inputs.nik,"model",e)},expression:"inputs.nik.model"}}),t.id?t._e():n("v-btn",{staticClass:"ml-2 mt-2",attrs:{small:"",rounded:"",color:"info",loading:t.checkNik.loading},on:{click:function(e){return t.checkNikNoExisting(t.inputs.nik.model)}}},[t._v("Check")])],1)],1),n("v-col",{attrs:{cols:"12",sm:"12",md:"12",lg:"6"}},[n("v-file-input",{attrs:{dense:"",color:"success","item-color":"success",outlined:"",rounded:"","hide-details":"",accept:"image/png, image/jpeg, image/bmp",placeholder:"Image File (*max 6mb)","prepend-icon":"mdi-camera",label:"Photo KTP / Licence (*max 6mb)",rules:[function(t){return!!t||"Field is required"}]},on:{change:t.photoFileChanged}}),t.inputs.photo.preview&&""!==t.inputs.photo.preview?n("v-card",{staticClass:"rounded-xl",attrs:{elevation:"2",height:"300"}},[n("v-img",{staticClass:"my-2 mb-4 rounded-xl cursor-pointer",attrs:{height:"300",src:t.inputs.photo.preview,id:"photo1"},on:{click:function(e){return t.showLightbox(t.inputs.photo.preview)}}})],1):t._e()],1),n("v-col",{attrs:{cols:"12",sm:"12",md:"12",lg:"6"}},[n("v-text-field",{staticClass:"mb-3",attrs:{dense:"",color:"success","hide-details":"",label:t.inputs.name.label,outlined:"",rounded:"",rules:[function(t){return!!t||"Field is required"}]},model:{value:t.inputs.name.model,callback:function(e){t.$set(t.inputs.name,"model",e)},expression:"inputs.name.model"}}),n("v-textarea",{attrs:{color:"success","hide-details":"",label:t.inputs.address.label,outlined:"",rounded:""},model:{value:t.inputs.address.model,callback:function(e){t.$set(t.inputs.address,"model",e)},expression:"inputs.address.model"}})],1)],1)],1),n("v-card-actions",[n("v-btn",{staticClass:"pr-3 pl-1",attrs:{color:"red",outlined:"",rounded:"",small:""},on:{click:function(e){t.showModal=!1}}},[n("v-icon",{staticClass:"mr-1"},[t._v("mdi-close-circle")]),t._v(" Close")],1),n("v-divider",{staticClass:"mx-2"}),n("v-dialog",{attrs:{persistent:"","max-width":"400","content-class":"rounded-xl"},scopedSlots:t._u([{key:"activator",fn:function(e){var i=e.on,a=e.attrs;return[n("v-btn",t._g(t._b({staticClass:"px-3",attrs:{color:"green white--text",rounded:"",small:"",disabled:!t.id&&(t.checkNik.loading||!t.checkNik.checked||t.inputs.nik.exist||!t.inputs.name.model)}},"v-btn",a,!1),i),[n("v-icon",{staticClass:"mr-1"},[t._v("mdi-content-save-check")]),t._v(" Save")],1)]}}]),model:{value:t.dialog,callback:function(e){t.dialog=e},expression:"dialog"}},[n("v-card",[n("v-card-title",{staticClass:"text-h5"},[n("v-spacer"),t._v(" Are u sure? "),n("v-spacer")],1),n("v-card-text",{staticClass:"text-center"},[t._v(" Are u sure wanna save this data? ")]),n("v-card-actions",[n("v-btn",{attrs:{color:"red",text:"",rounded:""},on:{click:function(e){t.dialog=!1}}},[n("v-icon",{staticClass:"mr-1"},[t._v("mdi-undo")]),t._v(" Back ")],1),n("v-divider",{staticClass:"mx-2"}),n("v-btn",{attrs:{color:"green white--text pr-3",rounded:""},on:{click:function(e){return t.save(t.id)}}},[n("v-icon",{staticClass:"mr-1"},[t._v("mdi-check-circle")]),t._v(" Ok, Save ")],1)],1)],1)],1)],1)],1)],1)},a=[],s=n("3835"),o=n("1da1"),r=(n("96cf"),n("99af"),n("d3b7"),n("4fad"),n("159b"),n("d81d"),n("3ca3"),n("ddb0"),n("2b3d"),n("b0c0"),n("c1df")),l=n.n(r),c=n("bc3a"),u=n.n(c),d={props:{show:{type:Boolean,default:!1},id:{type:String,default:0}},data:function(){return{dialog:!1,inputs:{address:{label:"Address",model:""},name:{label:"Name",model:""},nik:{exist:!1,label:"NIK / Licence Number",loading:!1,model:""},photo:{preview:"",model:null},program_year:{model:""},user_id:{model:JSON.parse(localStorage.getItem("User")).email}},checkNik:{checked:!1,loading:!1},loading:{show:!1,text:"Loading..."}}},watch:{"inputs.nik.exist":{handler:function(t){console.log(t)}},"inputs.nik.model":{handler:function(t){this.checkNik.checked=!1}},show:function(t){t||this.manageData("reset")}},computed:{showModal:{get:function(){return this.id>0&&this.getDetailData(this.id),this.show},set:function(t){this.$emit("close",{type:"driver",val:t})}}},mounted:function(){this.inputs.program_year.model=this.$store.state.programYear.model},methods:{getDetailData:function(t){var e=this;return Object(o["a"])(regeneratorRuntime.mark((function n(){var i;return regeneratorRuntime.wrap((function(n){while(1)switch(n.prev=n.next){case 0:return n.prev=0,e.loading.show=!0,n.next=4,u.a.get("".concat(e.$store.getters.getApiUrl("GetDetailDriver"),"?nik=").concat(t),e.$store.state.apiConfig);case 4:return i=n.sent,n.next=7,e.manageData("set",i.data.data.result);case 7:n.next=12;break;case 9:n.prev=9,n.t0=n["catch"](0),void 0!=n.t0.response?e.forceLogout(n.t0.response):console.log(n.t0);case 12:return n.prev=12,e.loading.show=!1,n.finish(12);case 15:case"end":return n.stop()}}),n,null,[[0,9,12,15]])})))()},checkNikNoExisting:function(t){var e=this;return Object(o["a"])(regeneratorRuntime.mark((function n(){return regeneratorRuntime.wrap((function(n){while(1)switch(n.prev=n.next){case 0:return e.inputs.nik.exist=!1,e.checkNik.checked=!1,e.checkNik.loading=!0,n.next=5,u.a.get("".concat(e.$store.getters.getApiUrl("GetDetailDriver"),"?nik=").concat(t),e.$store.state.apiConfig).then((function(){e.inputs.nik.exist=!0})).catch((function(n){var i=/^(\d{16}|\d{4}-\d{4}-\d{6})$/;i.test(t)?(e.inputs.nik.exist=!1,e.checkNik.checked=!0):alert("Nik / Licence are invalid."),e.forceLogout(n)})).finally((function(){e.checkNik.loading=!1}));case 5:case"end":return n.stop()}}),n)})))()},save:function(){var t=arguments,e=this;return Object(o["a"])(regeneratorRuntime.mark((function n(){var i,a,o,r,l,c,d,p,h;return regeneratorRuntime.wrap((function(n){while(1)switch(n.prev=n.next){case 0:for(i=t.length>0&&void 0!==t[0]?t[0]:null,n.prev=1,e.inputs.nik.exist=!1,e.dialog=!1,e.$emit("close",{type:"driver",val:!1}),e.$store.state.loadingOverlayText="Saving data...",e.$store.state.loadingOverlay=!0,a={},o=0,r=Object.entries(e.inputs);o<r.length;o++)l=Object(s["a"])(r[o],2),c=l[0],d=l[1],d.model&&(a[c]=d.model);if(!a.photo){n.next=13;break}return n.next=12,e.uploadPhotos("ktp-licence",a.photo,"driver-ktp_licence");case 12:a.photo=n.sent;case 13:return p="AddDriver",i&&(p="UpdateDriver"),n.next=17,u.a.post("".concat(e.$store.getters.getApiUrl(p)),a,e.$store.state.apiConfig);case 17:return n.next=19,e.$emit("snackbar",{color:"green",text:"Success saving driver data!"});case 19:return n.next=21,e.$emit("refreshTable");case 21:e.manageData("reset"),n.next=29;break;case 24:return n.prev=24,n.t0=n["catch"](1),n.next=28,e.$emit("snackbar",{color:"red",text:n.t0});case 28:void 0!=n.t0.response?(h=n.t0.response.data.data.result,"The nik has already been taken."==h&&(e.$refs["nikInput"].focus(),e.$emit("close",{type:"driver",val:!0}),e.inputs.nik.exist=!0),e.forceLogout(n.t0.response)):console.log(n.t0);case 29:return n.prev=29,e.$store.state.loadingOverlay=!1,e.$store.state.loadingOverlayText=null,n.finish(29);case 33:case"end":return n.stop()}}),n,null,[[1,24,29,33]])})))()},dateFormat:function(t,e){return l()(t).format(e)},forceLogout:function(t){401==t.status&&(localStorage.removeItem("token"),this.$router.push("/"))},generateFormData:function(t){var e=new FormData,n=Object.entries(t);return n.forEach((function(t){var n=Object(s["a"])(t,2),i=n[0],a=n[1];Array.isArray(a)?a.map((function(t){e.append(i+"[]",t)})):e.append(i,a)})),e},photoFileChanged:function(t){if(t){var e=t.size/1e6;console.log(e),e<6?(this.inputs.photo.model=t,this.inputs.photo.preview=URL.createObjectURL(t)):(alert("Please change your photo file, it's too big. Max 6mb."),this.inputs.photo.model=null,this.inputs.photo.preview=null)}else this.inputs.photo.model=null,this.inputs.photo.preview=""},manageData:function(t){var e=arguments,n=this;return Object(o["a"])(regeneratorRuntime.mark((function i(){var a;return regeneratorRuntime.wrap((function(i){while(1)switch(i.prev=i.next){case 0:a=e.length>1&&void 0!==e[1]?e[1]:null,n.inputs.program_year.model=n.$store.state.programYear.model,"dummy"==t?(n.inputs.nik.model=0xbcd867aa40ec9,n.inputs.name.model="Melvin",n.inputs.address.model="Jl. Sanggung Bar. No.11, RT.006/RW.002, Jatingaleh, Kec. Candisari, Kota Semarang, Jawa Tengah 50254"):"reset"==t?(n.inputs.nik.model="",n.inputs.name.model="",n.inputs.address.model="",n.inputs.photo.model="",n.inputs.photo.preview=""):"set"==t&&a&&(n.inputs.nik.model=a.nik,n.inputs.name.model=a.name,n.inputs.address.model=a.address,n.inputs.photo.model=a.photo,a.photo&&(n.inputs.photo.preview=n.$store.state.apiUrlImage+a.photo));case 3:case"end":return i.stop()}}),i)})))()},showLightbox:function(t,e){t&&(this.$store.state.lightbox.imgs=t),this.$store.state.lightbox.index=e||0,this.$store.state.lightbox.show=!0},uploadPhotos:function(t,e,n){var i=this;return Object(o["a"])(regeneratorRuntime.mark((function a(){var s,o,r,l;return regeneratorRuntime.wrap((function(a){while(1)switch(a.prev=a.next){case 0:return i.$store.state.loadingOverlayText='Saving photo "'.concat(t,'"...'),s="".concat(i.$store.state.apiUrlImage,"drivers_trucks/upload.php"),o="".concat(i.inputs.nik.model,"_").concat(t),r=i.generateFormData({dir:n,nama:o,image:e}),l=null,a.next=7,u.a.post(s,r).then((function(t){l=t.data.data.new_name})).catch((function(t){console.error(t)}));case 7:return a.abrupt("return","drivers_trucks/"+l);case 8:case"end":return a.stop()}}),a)})))()}}},p=d,h=n("2877"),m=n("6544"),v=n.n(m),g=n("0798"),f=n("c6a6"),x=n("8336"),b=n("b0af"),k=n("99d9"),w=n("62ad"),y=n("169a"),C=n("ce7e"),$=n("23a7"),S=n("132d"),_=n("adda"),V=n("a797"),O=n("490a"),I=n("0fd9"),N=n("2fa4"),D=n("8654"),j=n("a844"),z=Object(h["a"])(p,i,a,!1,null,null,null);e["default"]=z.exports;v()(z,{VAlert:g["a"],VAutocomplete:f["a"],VBtn:x["a"],VCard:b["a"],VCardActions:k["a"],VCardText:k["c"],VCardTitle:k["d"],VCol:w["a"],VDialog:y["a"],VDivider:C["a"],VFileInput:$["a"],VIcon:S["a"],VImg:_["a"],VOverlay:V["a"],VProgressCircular:O["a"],VRow:I["a"],VSpacer:N["a"],VTextField:D["a"],VTextarea:j["a"]})}}]);
//# sourceMappingURL=chunk-4f62500b.c3540203.js.map