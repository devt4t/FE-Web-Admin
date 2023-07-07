(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-59f0af22","chunk-74a7c0ba","chunk-74a7c0ba"],{"56a4":function(e,t,a){"use strict";a("a9e3"),a("d3b7"),a("25f0");var i=a("9d26"),n=a("a9ad"),s=a("3206"),r=a("5607"),o=a("58df"),l=Object(o["a"])(n["a"],Object(s["a"])("stepper","v-stepper-step","v-stepper"));t["a"]=l.extend().extend({name:"v-stepper-step",directives:{ripple:r["a"]},inject:["stepClick"],props:{color:{type:String,default:"primary"},complete:Boolean,completeIcon:{type:String,default:"$complete"},editable:Boolean,editIcon:{type:String,default:"$edit"},errorIcon:{type:String,default:"$error"},rules:{type:Array,default:function(){return[]}},step:[Number,String]},data:function(){return{isActive:!1,isInactive:!0}},computed:{classes:function(){return{"v-stepper__step--active":this.isActive,"v-stepper__step--editable":this.editable,"v-stepper__step--inactive":this.isInactive,"v-stepper__step--error error--text":this.hasError,"v-stepper__step--complete":this.complete}},hasError:function(){return this.rules.some((function(e){return!0!==e()}))}},mounted:function(){this.stepper&&this.stepper.register(this)},beforeDestroy:function(){this.stepper&&this.stepper.unregister(this)},methods:{click:function(e){e.stopPropagation(),this.$emit("click",e),this.editable&&this.stepClick(this.step)},genIcon:function(e){return this.$createElement(i["a"],e)},genLabel:function(){return this.$createElement("div",{staticClass:"v-stepper__label"},this.$slots.default)},genStep:function(){var e=!(this.hasError||!this.complete&&!this.isActive)&&this.color;return this.$createElement("span",this.setBackgroundColor(e,{staticClass:"v-stepper__step__step"}),this.genStepContent())},genStepContent:function(){var e=[];return this.hasError?e.push(this.genIcon(this.errorIcon)):this.complete?this.editable?e.push(this.genIcon(this.editIcon)):e.push(this.genIcon(this.completeIcon)):e.push(String(this.step)),e},toggle:function(e){this.isActive=e.toString()===this.step.toString(),this.isInactive=Number(e)<Number(this.step)}},render:function(e){return e("div",{staticClass:"v-stepper__step",class:this.classes,directives:[{name:"ripple",value:this.editable}],on:{click:this.click}},[this.genStep(),this.genLabel()])}})},"6d839":function(e){e.exports=JSON.parse('{"accessibility":[{"text":"Mudah","value":"easy"},{"text":"Sedang","value":"medium"},{"text":"Sulit","value":"hard"}],"agroforestry_type":[{"text":"Agroforestry Intensitas Tinggi","value":"agroforestry_high_intensive"},{"text":"Agroforestry Intensitas Rendah","value":"agroforestry_low_intensive"},{"text":"Konservasi","value":"conservation"}],"disaster_categories":[{"text":"Geologi ( terjadi di permukaan bumi seperti tsunami, gempa bumi, gunung meletus, dll )","value":"geologi"},{"text":"Meteorologi / Hidrometeorologi ( berhubungan dengan iklim seperti banjir dan kekeringan )","value":"meteorologi_hidrometeorologi"},{"text":"Ekstrateretial ( datangnya berbagai benda langit seperti asteroid atau gangguan badai matahari )","value":"ekstrateretial"}],"economic_distribution":[{"text":"UMKM","value":"umkm"},{"text":"KUD","value":"kud"},{"text":"Broker","value":"broker"},{"text":"Yang Lainnya","value":"other"}],"farmer_family_type":[{"text":"Keluarga Petani","value":"petani"},{"text":"Keluarga Non-Petani","value":"non_petani"}],"farmer_type_ownership":[{"text":"Milik Petani","value":"petani"},{"text":"Diluar Milik Petani","value":"non_petani"}],"fauna_food_source":[{"text":"Nabati","value":"nabati"},{"text":"Non-Nabati","value":"non_nabati"}],"fertilizer_categories":[{"text":"Alami","value":"natural"},{"text":"Kimia","value":"chemical"},{"text":"Keduanya","value":"both"}],"fertilizer_types":[{"text":"Urea","value":"urea"},{"text":"SP-36","value":"sp_36"},{"text":"KCL","value":"kcl"},{"text":"Humus","value":"humus"},{"text":"Kompos","value":"compost"},{"text":"Kandang","value":"manure"}],"fertilizer_sources":[{"text":"Produksi Sendiri","value":"self_production"},{"text":"Subsidi Pemerintah","value":"government"},{"text":"Pengadaan","value":"procurement"},{"text":"Yang Lainnya","value":"other"}],"flora_fauna_status":[{"text":"Punah","value":"extinct"},{"text":"Hampir Punah","value":"almost_extinct"},{"text":"Terancam Bahaya","value":"endangered"}],"land_ownership_type":[{"text":"Orang Luar Desa (Perorangan)","value":"orang_luar_desa"},{"text":"Lahan Desa","value":"lahan_desa"},{"text":"Negara","value":"negara"}],"land_type":["Andosol","Kambisol","Arenosol","Alvisol","Aluvial","Entisol","Gleisol","Grumosol","Histosol","Inseptisol","Litosol","Mediteran","Molisol","Nitosol","Organosol","Oxisol","Podsolik","Regosol"],"land_slope":["0 - 8\'","8\' - 15\'","15\' - 25\'","25\' - 45\'","> 45\'"],"land_height":["0 -300","300 - 550","550 - 850","850 - 1050","1050 -1350","1350 - 1550","1550 - 1900","> 1900"],"marketing_trade_method":[{"text":"Langsung ( Pasar, warung, pinggir jalan)","value":"direct"},{"text":"Tidak Langsung ( Tengkulak, broker, dll)","value":"indirect"}],"marketing_trade_method_complete":[{"text":"Langsung ( Pasar, warung, pinggir jalan)","value":"direct"},{"text":"Tidak Langsung ( Tengkulak, broker, dll)","value":"indirect"},{"text":"Konsumsi Sendiri","value":"own_consumption"}],"marketing_period":[{"text":"Harian","value":"daily"},{"text":"Mingguan","value":"weekly"},{"text":"Bulanan","value":"monthly"},{"text":"Musiman","value":"seasonal"},{"text":"Tahunan","value":"yearly"}],"pesticide_categories":[{"text":"Alami","value":"natural"},{"text":"Kimia","value":"chemical"},{"text":"Keduanya","value":"both"}],"pesticide_types":[{"text":"Akarisida","value":"akarisida"},{"text":"Algasida","value":"algasida"},{"text":"Alvisida","value":"alvisida"},{"text":"Bakterisida","value":"bakterisida"},{"text":"Fungisida","value":"fungisida"},{"text":"Herbisida","value":"herbisida"},{"text":"Insektisida","value":"insektisida"},{"text":"Moluskisida","value":"moluskisida"}],"pesticide_sources":[{"text":"Produksi Sendiri","value":"self_production"},{"text":"Subsidi Pemerintah","value":"government"},{"text":"Pengadaan","value":"procurement"},{"text":"Yang Lainnya","value":"other"}],"problem_categories":[{"text":"Birokrasi","value":"bureaucracy"},{"text":"Hewan","value":"animal_related"},{"text":"Bencana Alam","value":"force_majeur"},{"text":"Berhubungan Dengan Air","value":"water_related"},{"text":"Yang Lainnya","value":"other"}],"vegetation_density":["Tinggi","Sedang","Rendah","Terbuka"],"water_source":[{"text":"Sungai","value":"river"},{"text":"Waduk","value":"reservoir"},{"text":"Danau","value":"lake"},{"text":"Pam Desa","value":"pam_village"},{"text":"Mata Air","value":"water_springs"},{"text":"Sumur","value":"well"}],"rainfall":["0 - 500","500 - 1000","1000 - 1500","1500 - 2000","2000 - 2500","2500 - 3000"],"government_place":["Kantor Bupati","Kantor Camat","Kantor Lurah","Kanfor Kepala Desa","Kantor Polisi"],"land_coverage":["Hutan Rimba","Perkebunan/Kebun","Pemukiman","Sawah Tadah Hujan","Semak Belukar","Tegalan/Ladang"],"electricity_source":["PLN","Solarcell","Genset Desa"],"land_tenure_type":["Individual","Desa","Negara"],"land_tenure_func":["Area Pemanfaatan Lain","Perhutani/forest area"],"land_tenure_status":["Locally Own","Not Locally Own"],"farmer_speciality":["Budidaya","Meracik pupuk alternative","Inovasi sistem irigasi","Yang Lainnya"],"potential_categories":["Keberlangsungan","Keuntungan","Yang Lainnya"],"organic_categories":["Full Organik","Setengah Organik"],"organic_types":["Hidroponik","Aeroponik","Aquaponik","Yang Lainnya"],"innovative_rating":["0 - 25kg : sedang","25 - 50kg : bagus",">50kg : sangat bagus"],"income_employment":["Tenaga Kerja","Berdagang","Peternakan"],"marketingContractDetails":["Per Harvest Time","Per Season","Etc"],"wsConsumptions":["Domestik","Irigasi"],"wsCategories":["Sungai","Sumur","Mata Air","Yang Lainnya"],"wsTypes":["Natural","Buatan"],"wsSeasonal":["Q 1","Q 2","Q 3","Q 4"],"problemTypes":["Longsor","Kekeringan","Yang Lainnya"],"problemRank":["Ringan","Sedang","Berat"],"problemStakeholder":["Pemerintahan","NGO","Private Organization"],"problemStatus":["Solved","Not Solved","Rarely","Repeated"],"problemOwnership":["Locally Own","Not Locally Own"],"planting_categories":["Trees","Crops","MPTS"],"floraCategories":["Flora Asli","Holikultur","Gulma"],"floraTypes":["Berbji","Tumbuhan Paku","Yang Lainnya"],"floraNames":["Anggrek","Caringin","Kiara","Yang Lainnya"],"faunaCategories":["Asiatis","Peralihan","Australis","Yang Lainnya"],"faunaTypes":["Mamalia","Unggas","Reptile","Yang Lainnya"],"faunaNames":["Puesing","Landak","Burung Jalak","Yang Lainnya"],"incomeCategories":["Keluarga Petani","Bukan Keluarga Petani"],"incomeCropsCategories":["MPTS","Wood","Estate","Yang Lainnya"],"incomeCropsTypes":["Food","Feed","Fiber","Oil","Ornamental","Industrial"]}')},"7e85":function(e,t,a){"use strict";var i=a("5530"),n=(a("a9e3"),a("b0c0"),a("4de4"),a("8836"),a("3206")),s=a("a452"),r=a("7560"),o=a("58df"),l=a("d9bd"),c=Object(o["a"])(Object(n["b"])("stepper"),s["a"],r["a"]);t["a"]=c.extend({name:"v-stepper",provide:function(){return{stepClick:this.stepClick,isVertical:this.vertical}},props:{altLabels:Boolean,nonLinear:Boolean,vertical:Boolean},data:function(){var e={isBooted:!1,steps:[],content:[],isReverse:!1};return e.internalLazyValue=null!=this.value?this.value:(e[0]||{}).step||1,e},computed:{classes:function(){return Object(i["a"])({"v-stepper--is-booted":this.isBooted,"v-stepper--vertical":this.vertical,"v-stepper--alt-labels":this.altLabels,"v-stepper--non-linear":this.nonLinear},this.themeClasses)}},watch:{internalValue:function(e,t){this.isReverse=Number(e)<Number(t),t&&(this.isBooted=!0),this.updateView()}},created:function(){this.$listeners.input&&Object(l["a"])("@input","@change",this)},mounted:function(){this.updateView()},methods:{register:function(e){"v-stepper-step"===e.$options.name?this.steps.push(e):"v-stepper-content"===e.$options.name&&(e.isVertical=this.vertical,this.content.push(e))},unregister:function(e){"v-stepper-step"===e.$options.name?this.steps=this.steps.filter((function(t){return t!==e})):"v-stepper-content"===e.$options.name&&(e.isVertical=this.vertical,this.content=this.content.filter((function(t){return t!==e})))},stepClick:function(e){var t=this;this.$nextTick((function(){return t.internalValue=e}))},updateView:function(){for(var e=this.steps.length;--e>=0;)this.steps[e].toggle(this.internalValue);for(var t=this.content.length;--t>=0;)this.content[t].toggle(this.internalValue,this.isReverse)}},render:function(e){return e("div",{staticClass:"v-stepper",class:this.classes},this.$slots.default)}})},8836:function(e,t,a){},"9c54":function(e,t,a){"use strict";a.d(t,"a",(function(){return o})),a.d(t,"b",(function(){return l}));var i=a("80d2"),n=a("7e85"),s=a("56a4"),r=a("e516"),o=Object(i["i"])("v-stepper__header"),l=Object(i["i"])("v-stepper__items");n["a"],r["a"],s["a"]},e516:function(e,t,a){"use strict";a("a9e3"),a("d3b7"),a("25f0");var i=a("0789"),n=a("3206"),s=a("80d2"),r=a("58df"),o=Object(r["a"])(Object(n["a"])("stepper","v-stepper-content","v-stepper"));t["a"]=o.extend().extend({name:"v-stepper-content",inject:{isVerticalProvided:{from:"isVertical"}},props:{step:{type:[Number,String],required:!0}},data:function(){return{height:0,isActive:null,isReverse:!1,isVertical:this.isVerticalProvided}},computed:{computedTransition:function(){var e=this.$vuetify.rtl?!this.isReverse:this.isReverse;return e?i["f"]:i["g"]},styles:function(){return this.isVertical?{height:Object(s["g"])(this.height)}:{}}},watch:{isActive:function(e,t){e&&null==t?this.height="auto":this.isVertical&&(this.isActive?this.enter():this.leave())}},mounted:function(){this.$refs.wrapper.addEventListener("transitionend",this.onTransition,!1),this.stepper&&this.stepper.register(this)},beforeDestroy:function(){this.$refs.wrapper.removeEventListener("transitionend",this.onTransition,!1),this.stepper&&this.stepper.unregister(this)},methods:{onTransition:function(e){this.isActive&&"height"===e.propertyName&&(this.height="auto")},enter:function(){var e=this,t=0;requestAnimationFrame((function(){t=e.$refs.wrapper.scrollHeight})),this.height=0,setTimeout((function(){return e.isActive&&(e.height=t||"auto")}),450)},leave:function(){var e=this;this.height=this.$refs.wrapper.clientHeight,setTimeout((function(){return e.height=0}),10)},toggle:function(e,t){this.isActive=e.toString()===this.step.toString(),this.isReverse=t}},render:function(e){var t={staticClass:"v-stepper__content"},a={staticClass:"v-stepper__wrapper",style:this.styles,ref:"wrapper"};this.isVertical||(t.directives=[{name:"show",value:this.isActive}]);var i=e("div",a,[this.$slots.default]),n=e("div",t,[i]);return e(this.computedTransition,{on:this.$listeners},[n])}})},f9e9:function(e,t,a){"use strict";a.r(t);var i=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("v-dialog",{attrs:{"content-class":"rounded-xl mx-1","max-width":"1200",scrollable:"",persistent:""},model:{value:e.showModal,callback:function(t){e.showModal=t},expression:"showModal"}},[a("v-card",[a("v-card-title",{staticClass:"rounded-xl green darken-3 ma-1 pa-2"},[a("span",{staticClass:"white--text"},[a("v-btn",{staticClass:"white dark--text mr-1",attrs:{fab:"","x-small":""}},[a("v-icon",{attrs:{color:"grey darken-3"}},[e._v("mdi-file-document")])],1),e._v(" Sosialisasi Program Form "+e._s(this.form_no))],1),a("v-icon",{staticClass:"ml-auto",attrs:{color:"white"},on:{click:function(t){e.showModal=!1}}},[e._v("mdi-close-circle")])],1),a("v-card-text",{staticClass:"pa-0",staticStyle:{"min-height":"300px"}},[a("v-overlay",{attrs:{absolute:"",value:e.loading.show}},[a("div",{staticClass:"d-flex flex-column justify-center align-center"},[a("LottieAnimation",{ref:"anim",staticStyle:{height:"64px"},attrs:{animationData:e.lottie.data.loading,loop:!0}}),a("p",{staticClass:"mt-2 mb-0"},[e._v(" "+e._s(e.loading.text)+" "),a("v-progress-circular",{attrs:{size:17,width:3,indeterminate:"",color:"white"}})],1)],1)]),e.datas?a("div",[a("v-row",{staticClass:"ma-0 mx-2 mx-lg-4"},[a("v-col",{attrs:{cols:"12",md:"12",lg:"7"}},[a("v-card",{key:"location_card-"+e.showModal,staticClass:"rounded-lg",attrs:{"data-aos":"fade-down"}},[a("v-card-title",{staticClass:"grey darken-3 white--text pa-1 px-3"},[a("span",{staticStyle:{"font-size":"13px"}},[a("v-icon",{attrs:{color:"white"}},[e._v("mdi-map-marker")]),e._v(" Lokasi Desa ")],1)]),a("v-card-text",{staticClass:"pa-3"},[a("v-row",[a("v-col",{attrs:{cols:"12",md:"6",lg:"3"}},[a("v-card",{staticClass:"pa-2 elevation-0"},[a("span",{staticClass:"grey--text text--darken-2",staticStyle:{"font-size":"13px"}},[e._v(" Management Unit ")]),a("h4",[e._v(" "+e._s(e.datas.length>0&&e.datas[0].namaMU||"-")+" ")])])],1),a("v-col",{attrs:{cols:"12",md:"6",lg:"3"}},[a("v-card",{staticClass:"pa-2 elevation-0"},[a("span",{staticClass:"grey--text text--darken-2",staticStyle:{"font-size":"13px"}},[e._v(" Target Area ")]),a("h4",[e._v(" "+e._s(e.datas.length>0&&e.datas[0].namaTA||"-")+" ")])])],1),a("v-col",{attrs:{cols:"12",md:"6",lg:"3"}},[a("v-card",{staticClass:"pa-2 elevation-0"},[a("span",{staticClass:"grey--text text--darken-2",staticStyle:{"font-size":"13px"}},[e._v(" Desa ")]),a("h4",[e._v(" "+e._s(e.datas.length>0&&e.datas[0].namaDesa||"-")+" ")])])],1)],1)],1)],1)],1),a("v-col",{attrs:{cols:"12",md:"12",lg:"5"}},[a("v-card",{key:"date_period_card-"+e.showModal,staticClass:"rounded-lg",attrs:{"data-aos":"fade-down"}},[a("v-card-title",{staticClass:"grey darken-3 white--text pa-1 px-3"},[a("span",{staticStyle:{"font-size":"13px"}},[a("v-icon",{attrs:{color:"white"}},[e._v("mdi-calendar")]),e._v(" Tanggal Sosialisasi Program ")],1)]),a("v-card-text",{staticClass:"pa-3"},[a("v-row",[a("v-col",{attrs:{cols:"12"}},[a("v-card",{staticClass:"pa-2 elevation-0"},[a("span",{staticClass:"grey--text text--darken-2",staticStyle:{"font-size":"13px"}},[e._v(" "+e._s(e.datas.length>0&&e.datas[0].form_date||"-")+" ")]),a("h4")])],1)],1)],1)],1)],1)],1),a("v-stepper",{staticClass:"rounded-xl mt-2 elevation-0",attrs:{vertical:e.localConfig.windowWidth<e.localConfig.breakLayoutFrom},model:{value:e.stepper.model,callback:function(t){e.$set(e.stepper,"model",t)},expression:"stepper.model"}},[a("v-stepper-items",e._l(e.stepper.steps,(function(t,i){return a("div",[e.localConfig.windowWidth<e.localConfig.breakLayoutFrom&&e.stepper.steps.length>=1?a("v-stepper-step",{staticClass:"rounded-xl py-3 ma-1",attrs:{color:"green",complete:e.stepper.model>1,step:1,editable:""}},[a("span",[a("v-icon",{staticClass:"mr-1",attrs:{color:e.stepper.model>i+1?"green":""}},[e._v("mdi-"+e._s(e.stepper.steps_icon[i]))]),e._v(e._s(e.stepper.steps[i]))],1)]):e._e(),e.stepper.steps.length>=i+1?a("v-stepper-content",{staticClass:"pt-0",attrs:{step:i+1}},[a("v-card",{staticClass:"ma-1 rounded-xl",attrs:{"min-height":"250px"}},[a("v-card-text",e._l(e.groupingData[t],(function(t,i){return a("div",[t.label?a("div",{staticClass:"d-flex align-center my-8"},[a("p",{staticClass:"mb-0 grey--text text--darken-3",staticStyle:{"font-size":"17px"}},[a("v-icon",{staticClass:"mr-2"},[e._v(e._s(t.labelIcon))]),e._v(e._s(t.label)+" ")],1),a("v-divider",{staticClass:"mx-2",attrs:{color:""}})],1):e._e(),"table"===t.dataType?a("div",[a("v-data-table",{class:"rounded-xl elevation-6 mx-2 mx-lg-3 pa-1 elevation-3 overflow-hidden mt-4",attrs:{dense:t.table.dense,caption:t.table.caption,"multi-sort":"","hide-default-footer":t.table.hideDefaultFooter,headers:t.table.headers,items:e.dataListFarmer,"items-per-page":t.table.itemsPerPage,"show-expand":t.table.expand},scopedSlots:e._u([{key:"item.index",fn:function(t){var a=t.index;return[e._v(" "+e._s(a+1)+" ")]}},{key:"item.previewPhoto",fn:function(e){var t=e.item;return[a("v-img",{staticClass:"rounded-lg",attrs:{src:t.previewPhoto,"lazy-src":t.previewPhoto,alt:t.previewPhoto,width:"100",height:"100",contain:""}})]}}],null,!0)})],1):e._e()])})),0)],1)],1):e._e()],1)})),0)],1)],1):e._e()],1),e.verificationAccess&&e.datas.length>0?a("v-card-actions",{staticClass:"justify-center"},[0==e.datas[0].is_verified?a("v-btn",{staticClass:"pr-4",attrs:{rounded:"",color:"green",outlined:""},on:{click:function(){return e.confirmVerification("verify")}}},[a("v-icon",{staticClass:"mr-1"},[e._v("mdi-check-circle")]),e._v(" Verifikasi")],1):e._e(),1==e.datas[0].is_verified?a("v-btn",{staticClass:"pr-4",attrs:{rounded:"",color:"red",outlined:""},on:{click:function(){return e.confirmVerification("unverif")}}},[a("v-icon",{staticClass:"mr-1"},[e._v("mdi-close-circle")]),e._v(" Unverifikasi")],1):e._e()],1):e._e()],1)],1)},n=[],s=a("5530"),r=a("1da1"),o=(a("96cf"),a("d3b7"),a("caad"),a("2532"),a("d81d"),a("99af"),a("ac1f"),a("5319"),a("bc3a")),l=a.n(o),c=a("c1df"),u=a.n(c),d=a("86e6"),p=a("3d20"),v=a.n(p),h=(a("6d839"),a("1d71")),g={components:{LottieAnimation:d["a"]},props:{show:{type:Boolean,default:!1},id:{type:String,default:"0"},form_no:{type:String,default:null}},data:function(){return{datas:[],dataListFarmer:[],groupingData:{"List Petani":[{label:"List Petani",labelIcon:"mdi-flower",dataType:"table",dataSource:"",dataKey:"",table:{dense:!0,search:!0,searchValue:"",hideDefaultFooter:!1,itemsPerPage:20,headers:[{text:"No",value:"index",width:70,sortable:!1},{text:"Nama Petani",value:"name"},{text:"Photo Minat ",value:"previewPhoto"},{text:"Nama Training ",value:"namaTraining"},{text:"Pola ",value:"pattern"},{text:"Kayu Dan MPTS",value:"tree_mpts_name"},{text:"Status",value:"status_program"}]}}]},verified_data:0,loading:{show:!1,text:"Loading..."},localConfig:{windowWidth:window.innerWidth,breakLayoutFrom:1140,maxSubDataTotal:5,requiredInputIcon:"mdi-star"},lottie:{data:{loading:h}},stepper:{model:1,steps:["List Petani"],steps_icon:["account-group"]}}},computed:{showModal:{get:function(){return this.show&&this.form_no&&this.getData(this.form_no),this.show},set:function(e){e||this.$emit("action",{type:"close",name:"detail"})}},verificationAccess:function(){var e=this.$store.state.User,t=e.role_group,a=e.role_name;return"IT"==t||"SOCIAL OFFICER"==a}},watch:{"stepper.model":{handler:function(e){}}},methods:{confirmVerification:function(e){var t=this,a="verify"==e?"VerificationFormMinat":"UnVerificationFormMinat";v.a.fire({title:"Are you sure?",text:"You won't be able to revert this!",icon:"warning",showCancelButton:!0,confirmButtonColor:"#2e7d32",cancelButtonColor:"#d33",cancelButtonText:"Tidak Jadi",confirmButtonText:"Ya, Lanjutkan!"}).then((function(i){i.isConfirmed&&(t.loading.show=!0,t.loading.text="".concat("verify"==e?"Verifying":"Unverifying"," data..."),l.a.post(t.$store.getters.getApiUrl(a),{form_no:t.form_no,verified_by:t.$store.state.User.email},t.$store.state.apiConfig).then((function(a){v.a.fire({title:"Verified!",text:"Scooping data #".concat(t.id," has been verified."),icon:"success",confirmButtonColor:"#2e7d32"}),t.getData(t.form_no),t.$emit("swal",{type:"success",message:"Data ".concat("verify"==e?"Verified":"Unverified","!")})})).catch((function(e){t.errorResponse(e),v.a.fire({title:"Failed!",text:"Failed to proceed.",icon:"error",confirmButtonColor:"#f44336"})})).finally((function(){t.loading.show=!1,t.loading.text="Loading..."})))}))},errorResponse:function(e){var t=this;return Object(r["a"])(regeneratorRuntime.mark((function a(){var i,n;return regeneratorRuntime.wrap((function(a){while(1)switch(a.prev=a.next){case 0:if(console.log(e),!e.response){a.next=9;break}if(!e.response.status){a.next=9;break}if(401!=e.response.status){a.next=8;break}return a.next=6,v.a.fire({title:"Session Ended!",text:"Please login again.",icon:"warning",confirmButtonColor:"#2e7d32",confirmButtonText:"Okay"});case 6:i=a.sent,i&&(localStorage.removeItem("token"),t.$router.push("/"));case 8:500!==e.response.status&&400!==e.response.status||(n=e.response.data.message,n&&n.includes("Duplicate entry")&&(n="Data sudah ada!"),v.a.fire({title:"Error!",text:"".concat(n||e.message),icon:"error",confirmButtonColor:"#f44336"}));case 9:case"end":return a.stop()}}),a)})))()},getData:function(e){var t=this;return Object(r["a"])(regeneratorRuntime.mark((function a(){var i,n,r;return regeneratorRuntime.wrap((function(a){while(1)switch(a.prev=a.next){case 0:return a.prev=0,t.loading.show=!0,i={form_no:e},a.next=5,l.a.get(t.$store.getters.getApiUrl("GetFormMinatDetail"),Object(s["a"])({params:i},t.$store.state.apiConfig));case 5:n=a.sent,n&&(r=n.data.data.result,t.datas.push(r),t.datas.map((function(e){e.form_date=u()(e.form_date).format("DD MMMM YYYY")})),t.dataListFarmer=r.ListFarmer,t.dataListFarmer.map((function(e){e.previewPhoto=t.$store.state.apiUrlImage+e.photo,e.tree_mpts_name="".concat(e.tree1.tree_name,", ").concat(e.tree2.tree_name,", ").concat(e.tree3.tree_name)}))),a.next=12;break;case 9:a.prev=9,a.t0=a["catch"](0),t.errorResponse(a.t0);case 12:return a.prev=12,t.loading.show=!1,a.finish(12);case 15:case"end":return a.stop()}}),a,null,[[0,9,12,15]])})))()},getIntervalDay:function(e,t){var a=u()(e),i=u()(t),n=u.a.duration(i.diff(a)),s=n.asDays();return s},indonesianify:function(e){return"north"===e?"Utara":"east"===e?"Timur":"south"===e?"Selatan":"west"===e?"Barat":"??"},onResize:function(){this.localConfig.windowWidth=window.innerWidth},showLightbox:function(e,t){e&&(this.$store.state.lightbox.imgs=e),this.$store.state.lightbox.index=t||0,this.$store.state.lightbox.show=!0},whatsappPhone:function(e){return e.replace(/^0/,"62")}},mounted:function(){var e=this;this.$nextTick((function(){window.addEventListener("resize",e.onResize)}))}},m=g,f=a("2877"),x=a("6544"),_=a.n(x),b=a("8336"),y=a("b0af"),k=a("99d9"),w=a("62ad"),C=a("8fea"),S=a("169a"),L=a("ce7e"),P=a("132d"),T=a("adda"),A=a("a797"),V=a("490a"),B=a("0fd9"),D=a("7e85"),$=a("e516"),M=a("9c54"),I=a("56a4"),O=Object(f["a"])(m,i,n,!1,null,null,null);t["default"]=O.exports;_()(O,{VBtn:b["a"],VCard:y["a"],VCardActions:k["a"],VCardText:k["c"],VCardTitle:k["d"],VCol:w["a"],VDataTable:C["a"],VDialog:S["a"],VDivider:L["a"],VIcon:P["a"],VImg:T["a"],VOverlay:A["a"],VProgressCircular:V["a"],VRow:B["a"],VStepper:D["a"],VStepperContent:$["a"],VStepperItems:M["b"],VStepperStep:I["a"]})}}]);
//# sourceMappingURL=chunk-59f0af22.cd7af51e.js.map