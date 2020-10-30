webpackJsonp([23],{mgfc:function(t,e){},ueL9:function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var s=i("lHA8"),a=i.n(s),n=i("c/Tr"),r=i.n(n),c={name:"flightsEdit",data:function(){return{detailInfo:{},type:"",state:"detail"}},created:function(){this.type=this.$route.query.type,this.formatData()},methods:{saveEdit:function(){for(var t=this,e=this.detailInfo.cars,i={route_id:this.detailInfo.station_route_id,timer:{}},s=0;s<e.length;s++){for(var n=e[s],c=[],o=[],d=n.startArr,l=n.endArr,u=0;u<d.length;u++){if(!d[u].timer)return void this.$Message.warning("请选择班次时间");c.push(d[u].timer)}for(var _=0;_<l.length;_++){if(!l[_].timer)return void this.$Message.warning("请选择班次时间");o.push(l[_].timer)}var m=r()(new a.a(c)),p=r()(new a.a(o));if(m.length<c.length||p.length<o.length)return void this.$Message.warning("班次不可选择相同时间");var v={start:n.start,end:n.end,timer:{start:c,end:o}};i.timer[n.id]=v}this.$post("admin/classes/edit",i).then(function(e){t.$Spin.hide(),200===e.code?(localStorage.removeItem("flights"),t.$Message.success("修改成功"),setTimeout(function(){t.$router.push({name:"flightsList"})},1e3)):t.$Message.warning(e.error)}).catch(function(e){t.$Spin.hide()})},deleteFlights:function(t,e,i,s){e[t].splice(s,1),this.$set(this.detailInfo.cars,i,e)},addFlights:function(t,e,i){t[i].push({timer:""}),this.$set(this.detailInfo.cars,e,t)},timeChange:function(t,e,i,s,a){i.pickupTime="startArr"===a?this.getPickupTime(i.timer,t.start_pick_up_time):this.getPickupTime(i.timer,t.end_pick_up_time),this.$set(this.detailInfo.cars,e,t)},cancleEdit:function(){this.$router.push({name:"flightsList"}),localStorage.removeItem("flights")},formatData:function(){var t=this;this.detailInfo=JSON.parse(localStorage.getItem("flights")),this.detailInfo.cars.map(function(e){e.state="normal";var i=[],s=[];e.start_time.map(function(s){var a={timer:t.getTime(s),pickupTime:t.getPickupTime(s,e.start_pick_up_time)};i.push(a)}),e.end_time.map(function(i){var a={timer:t.getTime(i),pickupTime:t.getPickupTime(i,e.end_pick_up_time)};s.push(a)}),e.startArr=i,e.endArr=s})},getTime:function(t){var e=new Date("1970-12-01 "+t),i=e.getHours(),s=e.getMinutes();return i<10&&(i="0"+i),s<10&&(s="0"+s),[i,s].join(":")},getPickupTime:function(t,e){var i=new Date("1970-12-01 "+t).getTime()-1e3*e,s=new Date(i),a=s.getHours(),n=s.getMinutes(),r=s.getSeconds();return a<10&&(a="0"+a),n<10&&(n="0"+n),r<10&&(r="0"+r),[a,n].join(":")}}},o={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"flightsEdit_box"},[i("p",{staticClass:"line_text"},[t._v("线路："+t._s(t.detailInfo.station1)+"--\x3e"+t._s(t.detailInfo.station2))]),t._v(" "),i("div",{staticClass:"timer_box"},[t._l(t.detailInfo.cars,function(e,s){return i("div",{key:s,staticClass:"single_timer"},[i("p",{staticClass:"driver_info"},[i("span",[t._v("车辆："+t._s(e.plate_no))]),t._v(" "),i("span",[t._v("司机："+t._s(e.driver_name))]),t._v(" "),i("span",[t._v("站点："+t._s(e.park_name))])]),t._v(" "),i("div",{staticClass:"single_inner"},[i("div",{staticClass:"timer_start"},[i("p",{staticClass:"title"},[t._v("班次（往）")]),t._v(" "),t._l(e.startArr,function(a,n){return i("div",{key:n,staticClass:"timer_box"},[i("TimePicker",{staticStyle:{width:"168px"},attrs:{type:"time",format:"HH:mm",placeholder:"请选择发车时间",disabled:"detail"===t.type},on:{"on-change":function(i){return t.timeChange(e,s,a,n,"startArr")}},model:{value:a.timer,callback:function(e){t.$set(a,"timer",e)},expression:"start.timer"}}),t._v(" "),i("p",{staticClass:"pick_uptime"},[t._v("预计接人时间："+t._s(a.pickupTime))]),t._v(" "),"edit"==t.type?i("p",{staticClass:"delete_btn",on:{click:function(i){return t.deleteFlights("startArr",e,s,n)}}},[t._v("删除")]):t._e()],1)}),t._v(" "),"edit"===t.type?i("div",{staticClass:"add_box"},[i("Button",{staticClass:"add_btn",attrs:{type:"primary"},on:{click:function(i){return t.addFlights(e,s,"startArr")}}},[i("Icon",{attrs:{type:"md-add"}}),t._v("新增班次\n                        ")],1)],1):t._e()],2),t._v(" "),i("div",{staticClass:"timer_start timer_end"},[i("p",{staticClass:"title"},[t._v("班次（返）")]),t._v(" "),t._l(e.endArr,function(a,n){return i("div",{key:n,staticClass:"timer_box"},[i("TimePicker",{staticStyle:{width:"168px"},attrs:{type:"time",format:"HH:mm",placeholder:"请选择发车时间",disabled:"detail"===t.type},on:{"on-change":function(i){return t.timeChange(e,s,a,n,"ednArr")}},model:{value:a.timer,callback:function(e){t.$set(a,"timer",e)},expression:"end.timer"}}),t._v(" "),i("p",{staticClass:"pick_uptime"},[t._v("预计接人时间："+t._s(a.pickupTime))]),t._v(" "),"edit"===t.type?i("p",{staticClass:"delete_btn",on:{click:function(i){return t.deleteFlights("endArr",e,s,n)}}},[t._v("删除")]):t._e()],1)}),t._v(" "),"edit"===t.type?i("div",{staticClass:"add_box"},[i("Button",{staticClass:"add_btn",attrs:{type:"primary"},on:{click:function(i){return t.addFlights(e,s,"endArr")}}},[i("Icon",{attrs:{type:"md-add"}}),t._v("新增班次\n                        ")],1)],1):t._e()],2)])])}),t._v(" "),"edit"===t.type?i("div",{staticClass:"edit_btn"},[i("Button",{staticClass:"add_btn",attrs:{type:"primary"},on:{click:t.saveEdit}},[t._v("\n                保存\n            ")]),t._v(" "),i("Button",{staticClass:"add_btn",attrs:{type:"error"},on:{click:t.cancleEdit}},[t._v("\n                取消\n            ")])],1):t._e()],2)])},staticRenderFns:[]};var d=i("VU/8")(c,o,!1,function(t){i("mgfc")},"data-v-b5925038",null);e.default=d.exports}});
//# sourceMappingURL=23.4f8d10159a9875b86685.js.map