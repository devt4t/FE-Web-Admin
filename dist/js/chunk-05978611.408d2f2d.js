(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-05978611"],{"169a":function(t,e,n){"use strict";var i=n("5530"),a=n("2909"),o=n("ade3"),s=(n("a9e3"),n("498a"),n("caad"),n("2532"),n("7db0"),n("368e"),n("480e")),r=n("4ad4"),c=n("b848"),l=n("75eb"),d=n("e707"),u=n("e4d3"),h=n("21be"),m=n("f2e7"),p=n("a293"),v=n("58df"),g=n("d9bd"),f=n("80d2"),b=Object(v["a"])(r["a"],c["a"],l["a"],d["a"],u["a"],h["a"],m["a"]);e["a"]=b.extend({name:"v-dialog",directives:{ClickOutside:p["a"]},props:{dark:Boolean,disabled:Boolean,fullscreen:Boolean,light:Boolean,maxWidth:{type:[String,Number],default:"none"},noClickAnimation:Boolean,origin:{type:String,default:"center center"},persistent:Boolean,retainFocus:{type:Boolean,default:!0},scrollable:Boolean,transition:{type:[String,Boolean],default:"dialog-transition"},width:{type:[String,Number],default:"auto"}},data:function(){return{activatedBy:null,animate:!1,animateTimeout:-1,isActive:!!this.value,stackMinZIndex:200,previousActiveElement:null}},computed:{classes:function(){var t;return t={},Object(o["a"])(t,"v-dialog ".concat(this.contentClass).trim(),!0),Object(o["a"])(t,"v-dialog--active",this.isActive),Object(o["a"])(t,"v-dialog--persistent",this.persistent),Object(o["a"])(t,"v-dialog--fullscreen",this.fullscreen),Object(o["a"])(t,"v-dialog--scrollable",this.scrollable),Object(o["a"])(t,"v-dialog--animated",this.animate),t},contentClasses:function(){return{"v-dialog__content":!0,"v-dialog__content--active":this.isActive}},hasActivator:function(){return Boolean(!!this.$slots.activator||!!this.$scopedSlots.activator)}},watch:{isActive:function(t){var e;t?(this.show(),this.hideScroll()):(this.removeOverlay(),this.unbind(),null==(e=this.previousActiveElement)||e.focus())},fullscreen:function(t){this.isActive&&(t?(this.hideScroll(),this.removeOverlay(!1)):(this.showScroll(),this.genOverlay()))}},created:function(){this.$attrs.hasOwnProperty("full-width")&&Object(g["e"])("full-width",this)},beforeMount:function(){var t=this;this.$nextTick((function(){t.isBooted=t.isActive,t.isActive&&t.show()}))},beforeDestroy:function(){"undefined"!==typeof window&&this.unbind()},methods:{animateClick:function(){var t=this;this.animate=!1,this.$nextTick((function(){t.animate=!0,window.clearTimeout(t.animateTimeout),t.animateTimeout=window.setTimeout((function(){return t.animate=!1}),150)}))},closeConditional:function(t){var e=t.target;return!(this._isDestroyed||!this.isActive||this.$refs.content.contains(e)||this.overlay&&e&&!this.overlay.$el.contains(e))&&this.activeZIndex>=this.getMaxZIndex()},hideScroll:function(){this.fullscreen?document.documentElement.classList.add("overflow-y-hidden"):d["a"].options.methods.hideScroll.call(this)},show:function(){var t=this;!this.fullscreen&&!this.hideOverlay&&this.genOverlay(),this.$nextTick((function(){t.$nextTick((function(){t.previousActiveElement=document.activeElement,t.$refs.content.focus(),t.bind()}))}))},bind:function(){window.addEventListener("focusin",this.onFocusin)},unbind:function(){window.removeEventListener("focusin",this.onFocusin)},onClickOutside:function(t){this.$emit("click:outside",t),this.persistent?this.noClickAnimation||this.animateClick():this.isActive=!1},onKeydown:function(t){if(t.keyCode===f["y"].esc&&!this.getOpenDependents().length)if(this.persistent)this.noClickAnimation||this.animateClick();else{this.isActive=!1;var e=this.getActivator();this.$nextTick((function(){return e&&e.focus()}))}this.$emit("keydown",t)},onFocusin:function(t){if(t&&this.retainFocus){var e=t.target;if(e&&![document,this.$refs.content].includes(e)&&!this.$refs.content.contains(e)&&this.activeZIndex>=this.getMaxZIndex()&&!this.getOpenDependentElements().some((function(t){return t.contains(e)}))){var n=this.$refs.content.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'),i=Object(a["a"])(n).find((function(t){return!t.hasAttribute("disabled")}));i&&i.focus()}}},genContent:function(){var t=this;return this.showLazyContent((function(){return[t.$createElement(s["a"],{props:{root:!0,light:t.light,dark:t.dark}},[t.$createElement("div",{class:t.contentClasses,attrs:Object(i["a"])({role:"document",tabindex:t.isActive?0:void 0},t.getScopeIdAttrs()),on:{keydown:t.onKeydown},style:{zIndex:t.activeZIndex},ref:"content"},[t.genTransition()])])]}))},genTransition:function(){var t=this.genInnerContent();return this.transition?this.$createElement("transition",{props:{name:this.transition,origin:this.origin,appear:!0}},[t]):t},genInnerContent:function(){var t={class:this.classes,ref:"dialog",directives:[{name:"click-outside",value:{handler:this.onClickOutside,closeConditional:this.closeConditional,include:this.getOpenDependentElements}},{name:"show",value:this.isActive}],style:{transformOrigin:this.origin}};return this.fullscreen||(t.style=Object(i["a"])(Object(i["a"])({},t.style),{},{maxWidth:"none"===this.maxWidth?void 0:Object(f["g"])(this.maxWidth),width:"auto"===this.width?void 0:Object(f["g"])(this.width)})),this.$createElement("div",t,this.getContentSlot())}},render:function(t){return t("div",{staticClass:"v-dialog__container",class:{"v-dialog__container--attached":""===this.attach||!0===this.attach||"attach"===this.attach},attrs:{role:"dialog"}},[this.genActivator(),this.genContent()])}})},"368e":function(t,e,n){},4054:function(t,e,n){"use strict";n.r(e);var i=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",[n("v-dialog",{attrs:{"content-class":"rounded-xl mx-1","max-width":"700",scrollable:"",persistent:""},model:{value:t.showModalPickCoordinate,callback:function(e){t.showModalPickCoordinate=e},expression:"showModalPickCoordinate"}},[n("v-card",[n("v-card-title",{staticClass:"rounded-xl green darken-3 ma-1 pa-2"},[n("span",{staticClass:"white--text"},[n("v-btn",{staticClass:"white dark--text mr-1",attrs:{fab:"","x-small":""}},[n("v-icon",{attrs:{color:"grey darken-3"}},[t._v("mdi-map-marker")])],1),t._v(" Ambil Koordinat Lokasi Habitat")],1),n("v-icon",{staticClass:"ml-auto",attrs:{color:"white"},on:{click:function(e){t.showModalPickCoordinate=!1}}},[t._v("mdi-close-circle")])],1),n("v-card-text",{staticClass:"pa-2"},[t.showModalPickCoordinate?n("div",{staticStyle:{position:"relative"}},[t.maps.loading.show?n("v-overlay",{staticClass:"rounded-xl",attrs:{absolute:"","justify-center":"","align-center":""}},[n("div",{staticClass:"d-flex flex-column align-center justify-center"},[n("v-progress-circular",{attrs:{size:80,width:7,indeterminate:"",color:"white"}}),n("p",{staticClass:"mb-0 text-center mt-4"},[t._v(t._s(t.maps.loading.text||"Loading..."))])],1)]):t._e(),n("div",{key:"maps-pick-coordinat-habitat-location-"+t.showModalPickCoordinate,ref:"mapbox-pick-coordinate-habitat-location",staticClass:"rounded-xl overflow-hidden",staticStyle:{height:"400px",width:"100%"},attrs:{id:"mapboxPickCoordinateHabitatLocation"}})],1):t._e(),n("v-text-field",{staticClass:"mt-3",attrs:{color:"green",dense:"",outlined:"",rounded:"",value:t.getLongLatData,disabled:t.maps.loading.show,label:"Koordinat Distribusi (Long, Lat)",rules:[function(t){return!!t||"Field is required"}],"hide-details":"",readonly:!0}})],1),n("v-card-actions",{staticClass:"justify-center"},[n("v-btn",{attrs:{disabled:this.maps.loading.show,rounded:"",outlined:"",color:"green"},on:{click:function(e){return t.saveCoordinate()}}},[n("v-icon",[t._v("mdi-map-marker-check")]),t._v(" Simpan Titik Lokasi")],1)],1)],1)],1)],1)},a=[],o=n("1da1"),s=(n("96cf"),n("ac1f"),n("1276"),n("99af"),{props:{show:{type:Boolean,default:!1},data:{type:Object,default:null}},data:function(){return{maps:{accessToken:"",attribution:'&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a>',center:[113.9213,-.7893],geojson:{},hoveredStateId:0,key:111,layerId:0,layerStyle:{outline:{color:"#000000"},fill:{color:"#f06800"}},legends:{model:""},listMarker:[],loading:{show:!1,text:"Loading..."},location:{lng:"",lat:""},mapStyle:"",model:null,popup:{model:!1,content:{title:"",description:""}},url:"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",zoom:3}}},methods:{initializeMaps:function(){var t=this;return Object(o["a"])(regeneratorRuntime.mark((function e(){var n,i,a,s,r,c,l,d;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(e.prev=0,n=t.maps,n.loading.show=!0,n.loading.text="Initialize maps...",n.accessToken=t.$store.state.maps.accessToken,mapboxgl.accessToken=n.accessToken,i=t.data.model,a=/^[-+]?\d+(\.\d+)?,\s*[-+]?\d+(\.\d+)?$/,s=a.test(i),i&&s?(r=i.split(", ")[0],c=i.split(", ")[1],n.center=[r,c]):n.center=[113.9213,-.7893],mapboxgl.supported()){e.next=14;break}Swal.fire({title:"Warning!",text:"Your browser does not support Mapbox GL.",icon:"error",confirmButtonColor:"#f44336"}),e.next=20;break;case 14:return e.next=16,new mapboxgl.Map({container:"mapboxPickCoordinateHabitatLocation",style:"mapbox://styles/mapbox/satellite-streets-v11",center:n.center,zoom:n.zoom,projection:"globe"});case 16:return l=e.sent,d=new mapboxgl.GeolocateControl({positionOptions:{enableHighAccuracy:!0},trackUserLocation:!0,showUserHeading:!0}),e.next=20,l.on("load",Object(o["a"])(regeneratorRuntime.mark((function t(){var e,a;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return a=function(){var t=e.getLngLat();n.location=t},t.next=3,l.setFog({color:"rgb(186, 210, 235)","high-color":"rgb(36, 92, 223)","horizon-blend":.02,"space-color":"rgb(11, 11, 25)","star-intensity":.6});case 3:return l.addControl(new MapboxGeocoder({accessToken:mapboxgl.accessToken,mapboxgl:mapboxgl})),t.next=6,l.addControl(new mapboxgl.FullscreenControl);case 6:return t.next=8,l.addControl(new mapboxgl.NavigationControl);case 8:return t.next=10,l.addControl(d);case 10:if(n.location={lng:n.center[0],lat:n.center[1]},e=new mapboxgl.Marker({draggable:!0}).setLngLat(n.center).addTo(l),l.on("click",(function(t){e.setLngLat(t.lngLat),a()})),e.on("drag",a),d.on("trackuserlocationstart",(function(){n.loading.show=!0,n.loading.text="Mencari lokasi anda..."})),d.on("geolocate",function(){var t=Object(o["a"])(regeneratorRuntime.mark((function t(i){var o;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return o=[i.coords.longitude,i.coords.latitude],t.next=3,e.setLngLat(o);case 3:return t.next=5,a();case 5:n.loading.show=!1,n.loading.text="Loading...";case 7:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}()),!i){t.next=19;break}return t.next=19,l.flyTo({center:n.center,zoom:15,duration:4e3});case 19:n.loading.show=!1;case 20:case"end":return t.stop()}}),t)}))));case 20:e.next=25;break;case 22:e.prev=22,e.t0=e["catch"](0),console.log(e.t0);case 25:return e.prev=25,e.finish(25);case 27:case"end":return e.stop()}}),e,null,[[0,22,25,27]])})))()},saveCoordinate:function(){var t=this;return Object(o["a"])(regeneratorRuntime.mark((function e(){var n;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:n=t.maps.location,t.$emit("action",{type:"save",name:"pick_coordinate",data:t.data,coordinate:n});case 2:case"end":return e.stop()}}),e)})))()}},computed:{showModalPickCoordinate:{get:function(){var t=this;return this.show&&(this.maps.loading.show=!0,setTimeout((function(){t.initializeMaps()}),200)),this.show},set:function(t){t||this.$emit("action",{type:"close",name:"pick_coordinate"})}},getLongLatData:function(){var t=this.maps;return"".concat(t.location.lng,", ").concat(t.location.lat)}},mounted:function(){}}),r=s,c=n("2877"),l=n("6544"),d=n.n(l),u=n("8336"),h=n("b0af"),m=n("99d9"),p=n("169a"),v=n("132d"),g=n("a797"),f=n("490a"),b=n("8654"),w=Object(c["a"])(r,i,a,!1,null,null,null);e["default"]=w.exports;d()(w,{VBtn:u["a"],VCard:h["a"],VCardActions:m["a"],VCardText:m["c"],VCardTitle:m["d"],VDialog:p["a"],VIcon:v["a"],VOverlay:g["a"],VProgressCircular:f["a"],VTextField:b["a"]})}}]);
//# sourceMappingURL=chunk-05978611.408d2f2d.js.map