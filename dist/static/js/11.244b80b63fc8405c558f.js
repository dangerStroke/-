webpackJsonp([11],{Ju0k:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});a("P9l9"),a("f50S");var i={name:"site",data:function(){return{columns12:[{title:"站点编号",key:"id",align:"center"},{title:"站点名称",key:"name",align:"center"},{title:"区域范围",slot:"location",align:"center"},{title:"接人时间(h)",slot:"pick_up_time",align:"center"},{title:"操作",slot:"action",width:150,align:"center"}],data6:[],modal:!1,formLeft:{},modalTitle:"",quyuData:[],radioValue:"",pickUpTimeValue:"",pickUpTimeValueData:[.5,1,1.5,2],makeSureEditId:"",page:1,pagesize:10,total:0,proviceList:[],cityList:[],areaList:[],proviceValue:"",cityValue:"",areaValue:"",code:[],area:[]}},created:function(){var e=this;this.$Spin.show(),this.getTableData(),this.$fetch("/admin/dispatch/list-location").then(function(t){e.$Spin.hide(),t&&(200==t.code?e.quyuData=t.data.data:e.$Message.warning(t.error))}).catch(function(t){e.$Spin.hide()}),this.$fetch("https://static2.jd-gz.com/area.json").then(function(t){console.log(t),e.area=t;var a=[];t.map(function(e,i){var o={};return o.name=t[i].name,o.adcode=t[i].adcode,a.push(o),a}),e.proviceList=a})},watch:{radioValue:function(e,t){}},methods:{proviceChange:function(e){this.proviceValue=e;var t=[];this.area.map(function(a,i){a.adcode==e&&a.districts.map(function(e,i){var o={};return o.name=a.districts[i].name,o.adcode=a.districts[i].adcode,o.citycode=a.districts[i].citycode,t.push(o),t})}),console.log(t),this.cityList=t},cityChange:function(e){var t=this;console.log(e),this.cityValue=e;var a=[];this.cityList.map(function(t,i){if(t.adcode==e){var o={};o.citycode=t.citycode,o.adcode=t.adcode,o.name=t.name,a.push(o)}}),this.code=a;var i=[];this.area.map(function(a,o){a.adcode==t.proviceValue&&a.districts.map(function(t,a){t.adcode==e&&t.districts.map(function(e,t){var a={};return a.name=e.name,a.adcode=e.adcode,i.push(a),i})})}),console.log(i),this.areaList=i},areaChange:function(e){console.log(e),this.areaValue=e},getTableData:function(e){var t=this;"page"!==e&&(this.page=1);var a={page:this.page,pagesize:this.pagesize};this.$fetch("/admin/citytransport/list-station",a).then(function(e){if(console.log(e.data.data),e)if(200==e.code){var a=e.data.data;t.data6=a,t.total=e.data.total}else t.$Message.warning(e.error)}).catch(function(e){t.$Spin.hide()})},newSite:function(e){var t=this;console.log(e);var a=this;this.modal=!0,e.id?(this.modalTitle="修改站点",this.$fetch("/admin/citytransport/get-station",{id:e.id}).then(function(e){e&&(200==e.code?(t.formLeft=e.data,t.radioValue=e.data.location_id,t.pickUpTimeValue=e.data.pick_up_time/3600,t.makeSureEditId=e.data.id,t.area.map(function(t,i){if(t.adcode.substring(0,2)==e.data.ad_code.substring(0,2)){a.proviceValue=t.adcode;var o=[];t.districts.map(function(i,n){var c={};if(c.name=t.districts[n].name,c.adcode=t.districts[n].adcode,c.citycode=t.districts[n].citycode,o.push(c),i.citycode==e.data.city_code){a.cityValue=i.adcode,console.log(a.cityValue);var s=[];i.districts.map(function(t,i){var o={};return o.name=t.name,o.adcode=t.adcode,s.push(o),t.adcode==e.data.ad_code&&(a.areaValue=e.data.ad_code),s}),a.areaList=s}return o}),a.cityList=o}})):t.$Message.warning(e.error))}).catch(function(e){t.$Spin.hide()})):(this.modalTitle="新建站点",this.formLeft={},this.radioValue="",this.pickUpTimeValue="",this.proviceValue="",this.cityValue="",this.areaValue="",this.code=[])},remove:function(e,t){var a=this;this.$Modal.confirm({title:"你确定要删除该站点吗？",okText:"确定",cancelText:"取消",onOk:function(){var i=this;console.log("确定删除",e),this.$post("/admin/citytransport/del-station",{id:e}).then(function(e){console.log(e),e&&(200==e.code?(i.$Message.info("删除站点成功"),a.data6.splice(t,1)):i.$Message.warning(e.error))}).catch(function(e){i.$Spin.hide()})},onCancel:function(){console.log("点击了取消删除")}})},infoSure:function(e){var t=this;if("新建站点"==e)if(console.log("citycode",this.code[0].citycode),console.log("adcode",this.areaValue),this.formLeft.name&&this.radioValue&&this.pickUpTimeValue&&this.cityValue){var a=3600*this.pickUpTimeValue;this.$post("/admin/citytransport/add-station",{name:this.formLeft.name,pick_up_time:a,location_id:this.radioValue,city_code:this.code[0].citycode,ad_code:this.areaValue}).then(function(e){console.log(e),200==e.code?(t.$Message.info("新建站点成功"),t.modal=!1,t.getTableData()):502==e.code?(t.$Message.warning(""+e.error),t.getTableData()):t.$Message.warning(""+e.error)}).catch(function(e){t.$Spin.hide()})}else{if(!this.formLeft.name)return void this.$Message.warning("请填写站点名称");if(!this.radioValue)return void this.$Message.warning("请选择区域范围");if(!this.pickUpTimeValue)return void this.$Message.warning("请选择接人时间");if(!this.cityValue)return void this.$Message.warning("请选择城市")}else if("修改站点"==e&&(console.log(this.formLeft.name,this.radioValue,this.pickUpTimeValue,this.makeSureEditId),this.formLeft.name&&this.radioValue&&this.pickUpTimeValue&&this.makeSureEditId)){var i=3600*this.pickUpTimeValue;this.$post("/admin/citytransport/edit-station",{id:this.makeSureEditId,name:this.formLeft.name,pick_up_time:i,location_id:this.radioValue,city_code:this.code[0].citycode,ad_code:this.areaValue}).then(function(e){console.log(e),200==e.code?(t.$Message.info("修改站点成功"),t.modal=!1,t.getTableData()):t.$Message.warning(e.error)}).catch(function(e){t.$Spin.hide()})}},cancel:function(e){"新建站点"==e&&(this.formLeft.name=""),this.modal=!1},chooseTime:function(e){console.log(e)},changePage:function(e){this.page=e,this.getTableData("page")}}},o={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",[a("div",{staticClass:"new_site"},[a("Button",{attrs:{type:"primary"},on:{click:e.newSite}},[a("Icon",{attrs:{type:"md-add"}}),e._v("新建\n    ")],1)],1),e._v(" "),a("Table",{attrs:{border:"",columns:e.columns12,data:e.data6},scopedSlots:e._u([{key:"location",fn:function(t){var a=t.row;return t.index,[e._v(e._s(a.location.name?a.location.name:"--"))]}},{key:"pick_up_time",fn:function(t){var a=t.row;return t.index,[e._v(e._s(a.pick_up_time/3600)+"h")]}},{key:"action",fn:function(t){var i=t.row,o=t.index;return[a("Button",{staticStyle:{"margin-right":"5px"},attrs:{type:"primary",size:"small"},on:{click:function(t){return e.newSite(i)}}},[e._v("修改")]),e._v(" "),a("Button",{attrs:{type:"error",size:"small"},on:{click:function(t){return e.remove(i.id,o)}}},[e._v("删除")])]}}])}),e._v(" "),a("Modal",{attrs:{title:e.modalTitle,"mask-closable":!1,closable:!1},model:{value:e.modal,callback:function(t){e.modal=t},expression:"modal"}},[a("Form",{ref:"formLeft",attrs:{model:e.formLeft,"label-position":"left","label-width":100}},[a("FormItem",{attrs:{label:"站点名称",prop:"name",required:""}},[a("Input",{attrs:{maxlength:"10"},model:{value:e.formLeft.name,callback:function(t){e.$set(e.formLeft,"name",t)},expression:"formLeft.name"}})],1),e._v(" "),a("FormItem",{attrs:{label:"站点范围",required:""}},[a("RadioGroup",{model:{value:e.radioValue,callback:function(t){e.radioValue=t},expression:"radioValue"}},e._l(e.quyuData,function(t,i){return a("Radio",{key:i,attrs:{label:t.id}},[e._v(e._s(t.name))])}),1)],1),e._v(" "),a("FormItem",{attrs:{label:"城市",required:""}},[a("Select",{staticStyle:{width:"100px"},on:{"on-change":function(t){return e.proviceChange(e.proviceValue)}},model:{value:e.proviceValue,callback:function(t){e.proviceValue=t},expression:"proviceValue"}},e._l(e.proviceList,function(t){return a("Option",{key:t.adcode,attrs:{value:t.adcode}},[e._v("\n            "+e._s(t.name)+"\n          ")])}),1),e._v(" "),a("Select",{staticStyle:{width:"100px"},on:{"on-change":e.cityChange},model:{value:e.cityValue,callback:function(t){e.cityValue=t},expression:"cityValue"}},e._l(e.cityList,function(t){return a("Option",{key:t.adcode,attrs:{value:t.adcode}},[e._v("\n            "+e._s(t.name)+"\n          ")])}),1),e._v(" "),a("Select",{staticStyle:{width:"100px"},on:{"on-change":e.areaChange},model:{value:e.areaValue,callback:function(t){e.areaValue=t},expression:"areaValue"}},e._l(e.areaList,function(t){return a("Option",{key:t.adcode,attrs:{value:t.adcode}},[e._v("\n            "+e._s(t.name)+"\n          ")])}),1)],1),e._v(" "),a("FormItem",{attrs:{label:"接人时间",prop:"pickUpTimeValue",required:""}},[a("RadioGroup",{model:{value:e.pickUpTimeValue,callback:function(t){e.pickUpTimeValue=t},expression:"pickUpTimeValue"}},e._l(e.pickUpTimeValueData,function(t,i){return a("Radio",{key:i,attrs:{label:t}},[e._v(e._s(t)+"h")])}),1)],1)],1),e._v(" "),a("div",{attrs:{slot:"footer"},slot:"footer"},[a("Button",{attrs:{type:"text",size:"large"},on:{click:function(t){return e.cancel(e.modalTitle)}}},[e._v("取消")]),e._v(" "),a("Button",{attrs:{type:"primary",size:"large"},on:{click:function(t){return e.infoSure(e.modalTitle)}}},[e._v("确定")])],1)],1),e._v(" "),a("div",{staticClass:"page_box"},[a("div",{staticClass:"page_left"},[e._v("\n      共"+e._s(e.total)+"条记录 第"+e._s(e.page)+"/"+e._s(Math.ceil(e.total/e.pagesize))+"页\n    ")]),e._v(" "),a("div",{staticClass:"page_right"},[a("Page",{attrs:{total:e.total,"page-size":e.pagesize,current:e.page},on:{"on-change":e.changePage}})],1)])],1)},staticRenderFns:[]};var n=a("VU/8")(i,o,!1,function(e){a("dtmt")},"data-v-23edcadd",null);t.default=n.exports},dtmt:function(e,t){},f50S:function(e,t){}});
//# sourceMappingURL=11.244b80b63fc8405c558f.js.map