(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d230c73"],{ee74:function(t,a,e){"use strict";e.r(a);var r=function(){var t=this,a=t.$createElement,e=t._self._c||a;return t.raw_data?e("div",[e("h2",{staticStyle:{"text-align":"center"}},[t._v("Scooping Visit Report")]),e("p",{staticStyle:{"text-align":"center"}},[t._v("Form No: #"+t._s(this.id))]),e("h4",[t._v("1. Tanggal & Lokasi")]),e("table",{staticStyle:{width:"100%"},attrs:{id:"tableForExport-ScoopingVisit"}},[e("tr",[e("td",[t._v("Tanggal")]),e("td",{attrs:{colspan:"5"}},[t._v(" : "+t._s(this._utils.dateFormat(this.raw_data.start_scooping_date,"DD MMMM YYYY"))+" "+t._s(this.raw_data.start_scooping_date!=this.raw_data.end_scooping_date?" - "+this._utils.dateFormat(this.raw_data.end_scooping_date,"DD MMMM YYYY"):"")+" ")])]),e("tr",[e("td",[t._v("Provinsi")]),e("td",{attrs:{colspan:"5"}},[t._v(": "+t._s(this.raw_data.province_name))])]),e("tr",[e("td",[t._v("Kab / Kota")]),e("td",{attrs:{colspan:"5"}},[t._v(" : "+t._s(t._utils.capitalizeLetter(this.raw_data.city_name))+" ")])]),e("tr",[e("td",[t._v("Kecamatan")]),e("td",{attrs:{colspan:"5"}},[t._v(" : "+t._s(t._utils.capitalizeLetter(this.raw_data.district_name))+" ")])]),e("tr",[e("td",[t._v("Desa")]),e("td",{attrs:{colspan:"5"}},[t._v(" : "+t._s(t._utils.capitalizeLetter(this.raw_data.village_name))+" ")])])]),e("table",{staticStyle:{width:"100%","border-collapse":"collapse"},attrs:{border:"1"}},[e("tr",[t._m(0),e("td",[e("table",{staticStyle:{width:"100%","border-collapse":"collapse"},attrs:{border:"1"}},[e("tr",[e("td",[t._v("Luas Desa")]),e("td",{attrs:{colspan:"5"}},[t._v(": "+t._s(this.raw_data.land_area)+" Ha")])]),e("tr",[e("td",[t._v("Aksesibilitas")]),e("td",{attrs:{colspan:"5"}},[t._v(": "+t._s(this.raw_data.accessibility))])]),e("tr",[e("td",[t._v("Sumber Air")]),e("td",{attrs:{colspan:"5"}},[t._v(": "+t._s(this.raw_data.water_source))])]),e("tr",[e("td",[t._v("Sumber Listrik")]),e("td",{attrs:{colspan:"5"}},[t._v(": "+t._s(this.raw_data.electricity_source))])]),e("tr",[e("td",[t._v("Tempat Pemerintahan")]),e("td",{attrs:{colspan:"5"}},[t._v(": "+t._s(this.raw_data.goverment_place))])])])])]),e("tr",[t._m(1),e("td",[e("table",{staticStyle:{width:"100%","border-collapse":"collapse"},attrs:{border:"1"}},[e("tr",[e("td",[t._v("Total Keluarga")]),e("td",{attrs:{colspan:"5"}},[t._v(": "+t._s(this.raw_data.total_kk)+" KK")])]),e("tr",[e("td",[t._v("Total Laki - Laki")]),e("td",{attrs:{colspan:"5"}},[t._v(": "+t._s(this.raw_data.total_male)+" orang")])]),e("tr",[e("td",[t._v("Total Perempuan")]),e("td",{attrs:{colspan:"5"}},[t._v(": "+t._s(this.raw_data.total_female)+" orang")])]),e("tr",[e("td",[t._v("Total Dusun")]),e("td",{attrs:{colspan:"5"}},[t._v(": "+t._s(this.raw_data.total_dusun)+" dusun")])]),e("tr",[e("td",[t._v("Total Dusun Yang Berpotensi")]),e("td",{attrs:{colspan:"5"}},[t._v(": "+t._s(this.raw_data.potential_dusun)+" dusun")])]),e("tr",[e("td",[t._v("Deskripsi Potensi Dusun")]),e("td",{attrs:{colspan:"5"}},[t._v(" : "),e("div",{domProps:{innerHTML:t._s(this.raw_data.potential_description)}})])])])])]),e("tr",[t._m(2),e("td",[e("table",{staticStyle:{width:"100%","border-collapse":"collapse"},attrs:{border:"1"}},[e("tr",[e("td",[t._v("Luas Lahan Kering")]),e("td",{attrs:{colspan:"5"}},[t._v(": "+t._s(this.raw_data.dry_land_area)+" Ha")])]),e("tr",[e("td",[t._v("Jenis Tanah")]),e("td",{attrs:{colspan:"5"}},[t._v(": "+t._s(this.raw_data.land_type))])]),e("tr",[e("td",[t._v("Ketinggian Tanah (mdpl)")]),e("td",{attrs:{colspan:"5"}},[t._v(": "+t._s(this.raw_data.land_height))])]),e("tr",[t._m(3),e("td",{attrs:{colspan:"5"}},[t._v(": "+t._s(this.raw_data.land_slope))])]),e("tr",[e("td",[t._v("Kerapatan Vegetasi")]),e("td",{attrs:{colspan:"5"}},[t._v(": "+t._s(this.raw_data.vegetation_density))])]),e("tr",[e("td",[t._v("Pola Tanam Lahan Kering")]),e("td",{attrs:{colspan:"5"}},[t._v(": "+t._s(this.raw_data.agroforestry_type))])]),e("tr",[e("td",[t._v("Curah Hujan (mm)")]),e("td",{attrs:{colspan:"5"}},[t._v(": "+t._s(this.raw_data.rainfall))])])])])])]),e("div",{staticClass:"tokoh-desa",staticStyle:{"margin-top":"50px"}},[e("h4",[t._v("5. Tokoh Desa")]),e("table",{staticStyle:{width:"100%","border-collapse":"collapse"},attrs:{border:"1"}},[t._m(4),t._l(this.raw_data.scooping_figures,(function(a,r){return e("tr",{key:a.name},[e("td",{staticStyle:{"text-align":"center"}},[t._v(t._s(r+1))]),e("td",{staticStyle:{"text-align":"center"}},[t._v(t._s(a.name))]),e("td",{staticStyle:{"text-align":"center"}},[t._v(t._s(a.position))]),e("td",{staticStyle:{"text-align":"center"}},[t._v(t._s(a.phone))]),e("td",{staticStyle:{"text-align":"center"}},[t._v(t._s(a.whatsapp))])])}))],2)]),e("br"),e("br"),e("div",{staticClass:"image-data",staticStyle:{"margin-top":"60px"}},[e("table",{staticStyle:{width:"100%","border-collapse":"collapse"},attrs:{border:"1"}},[e("tr",[t._m(5),e("td",[e("table",t._l(this.raw_data.photo_road_access,(function(t,a){return e("tr",{key:t},[e("td",[e("img",{staticStyle:{margin:"auto",padding:"20px"},attrs:{height:"350",width:"350",src:t}})])])})),0)])]),e("tr",[t._m(6),e("td",[e("table",t._l(this.raw_data.photo_road_access,(function(t,a){return e("tr",{key:t},[e("td",[e("img",{staticStyle:{margin:"auto",padding:"20px"},attrs:{height:"350",width:"350",src:t}})])])})),0)])]),e("tr",[t._m(7),e("td",[e("table",t._l(this.raw_data.photo_dry_land,(function(t,a){return e("tr",{key:t},[e("td",[e("img",{staticStyle:{margin:"auto",padding:"20px"},attrs:{height:"350",width:"350",src:t}})])])})),0)])]),e("tr",[t._m(8),e("td",[e("table",[e("tr",[e("td",[e("img",{staticStyle:{margin:"auto",padding:"20px"},attrs:{height:"350",width:"350",src:this.raw_data.village_profile}})])])])])])])]),e("div",{staticClass:"footer",staticStyle:{"margin-top":"100px"}},[e("p",{staticStyle:{"text-align":"center"}},[t._v("Export Time: "+t._s(Date()))])])]):t._e()},s=[function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("td",{staticStyle:{margin:"auto",padding:"10px"}},[e("h4",[t._v("2. Data Desa")])])},function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("td",{staticStyle:{margin:"auto",padding:"10px"}},[e("h4",[t._v("3. Data Populasi")])])},function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("td",{staticStyle:{margin:"auto",padding:"10px"}},[e("h4",[t._v("4. Kelengkapan Data Lahan Kering")])])},function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("td",[t._v("Kelerengan Tanah ("),e("sup",[t._v("o")]),t._v(")")])},function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("tr",[e("th",[t._v("No")]),e("th",[t._v("Nama")]),e("th",[t._v("Jabatan")]),e("th",[t._v("No HP")]),e("th",[t._v("Whatsapp")])])},function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("td",{staticStyle:{margin:"auto",padding:"10px"}},[e("h4",[t._v("6. Gallery - Akses Jalan")])])},function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("td",{staticStyle:{margin:"auto",padding:"10px"}},[e("h4",[t._v("7. Gallery - Pertemuan")])])},function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("td",{staticStyle:{margin:"auto",padding:"10px"}},[e("h4",[t._v("8. Gallery - Lahan Kering")])])},function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("td",{staticStyle:{margin:"auto",padding:"10px"}},[e("h4",[t._v("9. Gallery - Profil Desa")])])}],i={props:{id:{type:String,default:"0"},raw_data:{type:Object,default:null}},data:function(){return{}},mounted:function(){},methods:{}},n=i,_=e("2877"),d=Object(_["a"])(n,r,s,!1,null,null,null);a["default"]=d.exports}}]);
//# sourceMappingURL=chunk-2d230c73.3b16d42d.js.map