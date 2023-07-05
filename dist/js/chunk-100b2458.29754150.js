(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-100b2458","chunk-74a7c0ba"],{"56a4":function(e,t,i){"use strict";i("a9e3"),i("d3b7"),i("25f0");var n=i("9d26"),a=i("a9ad"),s=i("3206"),r=i("5607"),o=i("58df"),u=Object(o["a"])(a["a"],Object(s["a"])("stepper","v-stepper-step","v-stepper"));t["a"]=u.extend().extend({name:"v-stepper-step",directives:{ripple:r["a"]},inject:["stepClick"],props:{color:{type:String,default:"primary"},complete:Boolean,completeIcon:{type:String,default:"$complete"},editable:Boolean,editIcon:{type:String,default:"$edit"},errorIcon:{type:String,default:"$error"},rules:{type:Array,default:function(){return[]}},step:[Number,String]},data:function(){return{isActive:!1,isInactive:!0}},computed:{classes:function(){return{"v-stepper__step--active":this.isActive,"v-stepper__step--editable":this.editable,"v-stepper__step--inactive":this.isInactive,"v-stepper__step--error error--text":this.hasError,"v-stepper__step--complete":this.complete}},hasError:function(){return this.rules.some((function(e){return!0!==e()}))}},mounted:function(){this.stepper&&this.stepper.register(this)},beforeDestroy:function(){this.stepper&&this.stepper.unregister(this)},methods:{click:function(e){e.stopPropagation(),this.$emit("click",e),this.editable&&this.stepClick(this.step)},genIcon:function(e){return this.$createElement(n["a"],e)},genLabel:function(){return this.$createElement("div",{staticClass:"v-stepper__label"},this.$slots.default)},genStep:function(){var e=!(this.hasError||!this.complete&&!this.isActive)&&this.color;return this.$createElement("span",this.setBackgroundColor(e,{staticClass:"v-stepper__step__step"}),this.genStepContent())},genStepContent:function(){var e=[];return this.hasError?e.push(this.genIcon(this.errorIcon)):this.complete?this.editable?e.push(this.genIcon(this.editIcon)):e.push(this.genIcon(this.completeIcon)):e.push(String(this.step)),e},toggle:function(e){this.isActive=e.toString()===this.step.toString(),this.isInactive=Number(e)<Number(this.step)}},render:function(e){return e("div",{staticClass:"v-stepper__step",class:this.classes,directives:[{name:"ripple",value:this.editable}],on:{click:this.click}},[this.genStep(),this.genLabel()])}})},"6d839":function(e){e.exports=JSON.parse('{"accessibility":["Mudah","Sedang","Sulit"],"land_type":["Andosol","Kambisol","Arenosol","Alvisol","Aluvial","Entisol","Gleisol","Grumosol","Histosol","Inseptisol","Litosol","Mediteran","Molisol","Nitosol","Organosol","Oxisol","Podsolik","Regosol"],"land_slope":["0 - 8\'","8\' - 15\'","15\' - 25\'","25\' - 45\'","> 45\'"],"land_height":["0 -300","300 - 550","550 - 850","850 - 1050","1050 -1350","1350 - 1550","1550 - 1900","> 1900"],"vegetation_density":["Tinggi","Sedang","Rendah","Terbuka"],"water_source":["Sungai","Waduk/Danau","Pam Desa","Sumur"],"rainfall":["0 - 500","500 - 1000","1000 - 1500","1500 - 2000","2000 - 2500","2500 - 3000"],"agroforestry_type":[{"text":"Agroforestry Intensitas Tinggi","value":"agroforestry_high_intensive"},{"text":"Agroforestry Intensitas Rendah","value":"agroforestry_low_intensive"},{"text":"Konservasi","value":"conservation"}],"government_place":["Kantor Bupati","Kantor Camat","Kantor Lurah","Kanfor Kepala Desa","Kantor Polisi"],"land_coverage":["Hutan Rimba","Perkebunan/Kebun","Pemukiman","Sawah Tadah Hujan","Semak Belukar","Tegalan/Ladang"],"electricity_source":["PLN","Solarcell","Genset Desa"],"land_tenure_type":["Individual","Desa","Negara"],"land_tenure_func":["Area Pemanfaatan Lain","Perhutani/forest area"],"land_tenure_status":["Locally Own","Not Locally Own"],"farmer_speciality":["Budidaya","Meracik pupuk alternative","Inovasi sistem irigasi","Yang Lainnya"],"potential_categories":["Keberlangsungan","Keuntungan","Yang Lainnya"],"organic_categories":["Full Organik","Setengah Organik"],"organic_types":["Hidroponik","Aeroponik","Aquaponik","Yang Lainnya"],"innovative_rating":["0 - 25kg : sedang","25 - 50kg : bagus",">50kg : sangat bagus"],"disaster_categories":["Air","Angin","Tanah","Api"],"fertilizer_categories":["Natural","Kimia","Keduanya"],"fertilizer_types":["Urea","SP-36","KCL","Humus","Kompos","Kandang"],"fertilizer_sources":["Produksi Sendiri","Pemerintah","Procurement","Yang Lainnya"],"income_employment":["Tenaga Kerja","Berdagang","Peternakan"],"marketingTradeMethod":[{"text":"Langsung ( Pasar, warung, pinggir jalan)","value":"langsung"},{"text":"Tidak Langsung ( Tengkulak, broker, dll)","value":"tidak_langsung"}],"marketingPeriod":[{"text":"Mingguan","value":"mingguan"},{"text":"Bulanan","value":"bulanan"},{"text":"Musiman","value":"musiman"},{"text":"Tahunan","value":"tahunan"}],"marketingContractDetails":["Per Harvest Time","Per Season","Etc"],"wsConsumptions":["Domestik","Irigasi"],"wsCategories":["Sungai","Sumur","Mata Air","Yang Lainnya"],"wsTypes":["Natural","Buatan"],"wsSeasonal":["Q 1","Q 2","Q 3","Q 4"],"problemCategories":["Birokrasi","Hewan","Force Majeur","Berhubungan dengan Air","Yang Lainnya"],"problemTypes":["Longsor","Kekeringan","Yang Lainnya"],"problemRank":["Ringan","Sedang","Berat"],"problemStakeholder":["Pemerintahan","NGO","Private Organization"],"problemStatus":["Solved","Not Solved","Rarely","Repeated"],"problemOwnership":["Locally Own","Not Locally Own"],"pesticide_categories":["Natural","Kimia","Keduanya"],"pesticide_types":["Akarisida","Algasida","Alvisida","Bakterisida","Fungisida","Herbisida","Insektisida","Moluskisida"],"pesticide_names":["Yosan","Konfidor","Gramoxon"],"pesticide_sources":["Pemerintahan","Procurement","Yang Lainnya"],"planting_categories":["Trees","Crops","MPTS"],"floraCategories":["Flora Asli","Holikultur","Gulma"],"floraTypes":["Berbji","Tumbuhan Paku","Yang Lainnya"],"floraNames":["Anggrek","Caringin","Kiara","Yang Lainnya"],"floraStatus":["Punah","Hampir Punah"],"faunaCategories":["Asiatis","Peralihan","Australis","Yang Lainnya"],"faunaTypes":["Mamalia","Unggas","Reptile","Yang Lainnya"],"faunaNames":["Puesing","Landak","Burung Jalak","Yang Lainnya"],"faunaFoodSource":["Nabati","Non-nabati"],"faunaStatus":["Punah","Hampir Punah"],"incomeCategories":["Keluarga Petani","Bukan Keluarga Petani"],"incomeCropsCategories":["MPTS","Wood","Estate","Yang Lainnya"],"incomeCropsTypes":["Food","Feed","Fiber","Oil","Ornamental","Industrial"],"economicDistribution":["UMKM","KUD","Broker","Yang Lainnya"]}')},"7e85":function(e,t,i){"use strict";var n=i("5530"),a=(i("a9e3"),i("b0c0"),i("4de4"),i("8836"),i("3206")),s=i("a452"),r=i("7560"),o=i("58df"),u=i("d9bd"),l=Object(o["a"])(Object(a["b"])("stepper"),s["a"],r["a"]);t["a"]=l.extend({name:"v-stepper",provide:function(){return{stepClick:this.stepClick,isVertical:this.vertical}},props:{altLabels:Boolean,nonLinear:Boolean,vertical:Boolean},data:function(){var e={isBooted:!1,steps:[],content:[],isReverse:!1};return e.internalLazyValue=null!=this.value?this.value:(e[0]||{}).step||1,e},computed:{classes:function(){return Object(n["a"])({"v-stepper--is-booted":this.isBooted,"v-stepper--vertical":this.vertical,"v-stepper--alt-labels":this.altLabels,"v-stepper--non-linear":this.nonLinear},this.themeClasses)}},watch:{internalValue:function(e,t){this.isReverse=Number(e)<Number(t),t&&(this.isBooted=!0),this.updateView()}},created:function(){this.$listeners.input&&Object(u["a"])("@input","@change",this)},mounted:function(){this.updateView()},methods:{register:function(e){"v-stepper-step"===e.$options.name?this.steps.push(e):"v-stepper-content"===e.$options.name&&(e.isVertical=this.vertical,this.content.push(e))},unregister:function(e){"v-stepper-step"===e.$options.name?this.steps=this.steps.filter((function(t){return t!==e})):"v-stepper-content"===e.$options.name&&(e.isVertical=this.vertical,this.content=this.content.filter((function(t){return t!==e})))},stepClick:function(e){var t=this;this.$nextTick((function(){return t.internalValue=e}))},updateView:function(){for(var e=this.steps.length;--e>=0;)this.steps[e].toggle(this.internalValue);for(var t=this.content.length;--t>=0;)this.content[t].toggle(this.internalValue,this.isReverse)}},render:function(e){return e("div",{staticClass:"v-stepper",class:this.classes},this.$slots.default)}})},8836:function(e,t,i){},"9c54":function(e,t,i){"use strict";i.d(t,"a",(function(){return o})),i.d(t,"b",(function(){return u}));var n=i("80d2"),a=i("7e85"),s=i("56a4"),r=i("e516"),o=Object(n["i"])("v-stepper__header"),u=Object(n["i"])("v-stepper__items");a["a"],r["a"],s["a"]},e516:function(e,t,i){"use strict";i("a9e3"),i("d3b7"),i("25f0");var n=i("0789"),a=i("3206"),s=i("80d2"),r=i("58df"),o=Object(r["a"])(Object(a["a"])("stepper","v-stepper-content","v-stepper"));t["a"]=o.extend().extend({name:"v-stepper-content",inject:{isVerticalProvided:{from:"isVertical"}},props:{step:{type:[Number,String],required:!0}},data:function(){return{height:0,isActive:null,isReverse:!1,isVertical:this.isVerticalProvided}},computed:{computedTransition:function(){var e=this.$vuetify.rtl?!this.isReverse:this.isReverse;return e?n["f"]:n["g"]},styles:function(){return this.isVertical?{height:Object(s["g"])(this.height)}:{}}},watch:{isActive:function(e,t){e&&null==t?this.height="auto":this.isVertical&&(this.isActive?this.enter():this.leave())}},mounted:function(){this.$refs.wrapper.addEventListener("transitionend",this.onTransition,!1),this.stepper&&this.stepper.register(this)},beforeDestroy:function(){this.$refs.wrapper.removeEventListener("transitionend",this.onTransition,!1),this.stepper&&this.stepper.unregister(this)},methods:{onTransition:function(e){this.isActive&&"height"===e.propertyName&&(this.height="auto")},enter:function(){var e=this,t=0;requestAnimationFrame((function(){t=e.$refs.wrapper.scrollHeight})),this.height=0,setTimeout((function(){return e.isActive&&(e.height=t||"auto")}),450)},leave:function(){var e=this;this.height=this.$refs.wrapper.clientHeight,setTimeout((function(){return e.height=0}),10)},toggle:function(e,t){this.isActive=e.toString()===this.step.toString(),this.isReverse=t}},render:function(e){var t={staticClass:"v-stepper__content"},i={staticClass:"v-stepper__wrapper",style:this.styles,ref:"wrapper"};this.isVertical||(t.directives=[{name:"show",value:this.isActive}]);var n=e("div",i,[this.$slots.default]),a=e("div",t,[n]);return e(this.computedTransition,{on:this.$listeners},[a])}})}}]);
//# sourceMappingURL=chunk-100b2458.29754150.js.map