webpackJsonp([33],{"h+l6":function(t,e){},nft4:function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var a={name:"list",data:function(){return{statusList:[{label:"全部",value:0},{label:"咨询中",value:1},{label:"已确认",value:2},{label:"已完成",value:3},{label:"已取消",value:4}],columns:[{title:"操作",slot:"action",align:"center",width:400},{type:"index",title:"序号",width:80,align:"center"},{title:"咨询状态",key:"status_text",width:100},{title:"姓名",key:"name",width:140},{title:"电话",key:"phone",width:130},{title:"线路",key:"route_text",width:160},{title:"出发日期",key:"ticket_time_string",width:130},{title:"人数",key:"member_number",width:80},{title:"上车地址",key:"start_name",width:250},{title:"下车地址",key:"end_name",width:250},{title:"备注",key:"remark",width:200}],listData:[],page:1,pagesize:10,total:0,deleteId:"",name:"",status:-1,ticket_time:"",showDeleta:!1,showAdd:!1,routeList:[],modalTitle:"新建咨询",editInfo:{name:"",member_number:null,phone:"",route:"",class:"",start_name:"",end_name:"",remark:"",ticket_time:"",id:""},options3:{disabledDate:function(t){return t&&t.valueOf()<Date.now()-864e5}},timerList:[],editType:"add",showDetail:!1}},watch:{editInfo:{handler:function(){"detail"!=this.editType&&this.editInfo.route&&this.editInfo.ticket_time&&(this.getTimers(),console.log(123),console.log(this.editInfo))},deep:!0}},created:function(){this.getRouteList(),this.getList()},methods:{changeStatus:function(t,e){4===e?this.deleteArea(t):this.bindDelete(t,e)},bindDelete:function(t,e){var i=this,a={id:t,status:e};this.$post("/admin/tel-reserve/change-status",a).then(function(t){200===t.code?(4===e?(i.deleteArea(""),i.$Message.success("取消成功")):i.$Message.success("修改成功"),i.getList("")):i.$Message.warning(t.error)}).catch(function(t){i.$Spin.hide(),i.$Message.warning("服务端异常")})},confirmChange:function(t){this.$post("/admin/tel-reserve/change-status",t).then(function(t){t.code})},modalChange:function(t,e){t||(this.editType="",this.editInfo={name:"",member_number:null,phone:"",route:"",class:"",start_name:"",end_name:"",remark:"",ticket_time:"",id:""})},compareDate:function(t){var e=new Date,i=(e.getFullYear(),e.getMonth(),e.getDate(),new Date(this.editInfo.ticket_time+" "+t).getTime());return!(e.getTime()>=i)},dateChange:function(t,e){"ticket_time"===e?this.ticket_time=t:(this.$refs.resetSelect.clearSingleSelect(),"date"===e&&(this.editInfo.ticket_time=t))},confirmSubmit:function(t){var e=this,i=this.editInfo,a="";a="edit"===this.editType?"修改成功":"添加成功";i.name?i.member_number?/^1[3456789]\d{9}$/.test(i.phone)?i.route?i.ticket_time?i.class?i.start_name?i.end_name?(i.ticket_time=new Date(i.ticket_time).getTime()/1e3,this.$post("/admin/tel-reserve/add",i).then(function(t){200===t.code?(e.$Message.success(a),e.cancleEdit("cancle"),e.getList("")):e.$Message.warning(t.error)})):this.$Message.warning("请填写下车地点"):this.$Message.warning("请填写上车地点"):this.$Message.warning("请选择班次"):this.$Message.warning("请选择出发日期"):this.$Message.warning("请选择线路"):this.$Message.warning("请填写正确的手机号码"):this.$Message.warning("请填写坐车人数（人数必须大于0）"):this.$Message.warning("请填写乘客姓名")},cancleEdit:function(t){"cancle"===t?(this.showAdd=!1,this.modalTitle="",this.editInfo={name:"",member_number:null,phone:"",route:"",class:"",start_name:"",end_name:"",remark:"",ticket_time:"",id:""}):this.confirmSubmit(t)},getTimers:function(){var t=this;this.$fetch("/admin/tel-reserve/get-class?station_route_id="+this.editInfo.route+"&date="+this.editInfo.ticket_time).then(function(e){if(200===e.code&&e.data.length>0){var i=[];e.data.map(function(e){t.compareDate(e.start_time)&&i.push(e),"edit"===t.editType&&t.editInfo.class===e.start_time&&i.push(e)}),t.timerList=i}})},getRouteList:function(){var t=this;this.$fetch("/admin/index/select-route").then(function(e){if(e.data){var i=e.data,a=[];for(var s in i){var n={name:i[s],value:s};a.push(n)}t.routeList=a}}).catch(function(e){t.$Spin.hide()})},changePage:function(t){this.page=t,this.getList("page")},initData:function(){this.name="",this.status=-1,this.ticket_time="",this.getList("")},getList:function(t){var e=this,i=this.page,a=this.pagesize,s=this.name,n=this.status,l=this.ticket_time;"page"!==t&&(this.page=1);var o={page:i,pagesize:a,name:s,status:n,ticket_time:l};o.status<=0&&(o.status=""),o.ticket_time&&(o.ticket_time=new Date(o.ticket_time).getTime()/1e3),this.$fetch("/admin/tel-reserve/get",o).then(function(t){if(e.$Spin.hide(),200===t.code){e.total=t.data.total;var i=t.data.data;i.map(function(t){t.ticket_time_string=e.$formatDate(new Date(1e3*t.ticket_time),"yyyy-MM-dd")}),e.listData=i}else e.$Message.warning(t.error)}).catch(function(t){e.$Message.warning("服务端异常")})},bindAdd:function(t,e){if(this.editType=t,"add"===t)this.showAdd=!0,this.modalTitle="新建咨询";else if("edit"===t){this.showAdd=!0,this.modalTitle="修改咨询";var i=e.id,a=e.name,s=e.phone,n=e.member_number,l=e.route,o=e.start_name,c=e.end_name,r=e.remark;this.editInfo={id:i,name:a,phone:s,member_number:n,route:l,start_name:o,end_name:c,remark:r},this.editInfo.ticket_time=e.ticket_time_string,this.editInfo.class=e.class}else"detail"===t&&(this.modalTitle="咨询详情",e.ticket_time=e.ticket_time_string,this.editInfo=e,this.showAdd=!1,this.showDetail=!0)},deleteArea:function(t){t?(this.deleteId=t,this.showDeleta=!0):(this.showDeleta=!1,this.deleteId="")},areaDetail:function(t){this.$router.push({name:"areaDetail",params:{id:t}})}}},s={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"list_container"},[i("div",{staticClass:"search_box"},[i("div",{staticClass:"search_left"},[i("div",{staticClass:"search_single"},[i("Input",{staticStyle:{width:"180px"},attrs:{placeholder:"请输入乘客姓名"},model:{value:t.name,callback:function(e){t.name=e},expression:"name"}})],1),t._v(" "),i("div",{staticClass:"search_single"},[i("Select",{staticStyle:{width:"180px"},attrs:{placeholder:"订单状态"},model:{value:t.status,callback:function(e){t.status=e},expression:"status"}},t._l(t.statusList,function(e){return i("Option",{key:e.value,attrs:{value:e.value}},[t._v(t._s(e.label))])}),1)],1),t._v(" "),i("div",{staticClass:"search_single"},[i("DatePicker",{staticStyle:{width:"180px"},attrs:{value:t.ticket_time,type:"date",placeholder:"选择出发日期"},on:{"on-change":function(e){return t.dateChange(e,"ticket_time")}}})],1)]),t._v(" "),i("div",{staticClass:"search_right"},[i("Button",{attrs:{type:"primary"},on:{click:function(e){return t.getList("")}}},[t._v("搜索")]),t._v(" "),i("Button",{attrs:{type:"error"},on:{click:t.initData}},[t._v("清空")]),t._v(" "),i("Button",{staticClass:"add_btn",attrs:{type:"primary"},on:{click:function(e){return t.bindAdd("add",{})}}},[i("Icon",{attrs:{type:"md-add"}}),t._v("新建\n            ")],1)],1)]),t._v(" "),i("div",{staticClass:"table_box"},[i("Table",{attrs:{border:"",columns:t.columns,data:t.listData},scopedSlots:t._u([{key:"action",fn:function(e){var a=e.row;return[i("Button",{attrs:{type:"primary"},on:{click:function(e){return t.bindAdd("detail",a)}}},[t._v("查看详情")]),t._v(" "),1==a.status||2==a.status?i("Button",{attrs:{type:"warning"},on:{click:function(e){return t.bindAdd("edit",a)}}},[t._v("修改")]):t._e(),t._v(" "),1==a.status?i("Button",{attrs:{type:"info"},on:{click:function(e){return t.changeStatus(a.id,2)}}},[t._v("确认")]):t._e(),t._v(" "),1==a.status||2==a.status?i("Button",{attrs:{type:"success"},on:{click:function(e){return t.changeStatus(a.id,3)}}},[t._v("完成")]):t._e(),t._v(" "),3!=a.status&&4!=a.status?i("Button",{attrs:{type:"error"},on:{click:function(e){return t.changeStatus(a.id,4)}}},[t._v("取消")]):t._e()]}}])}),t._v(" "),i("div",{staticClass:"page_box"},[i("div",{staticClass:"page_left"},[t._v("\n                共"+t._s(t.total)+"条记录 第"+t._s(t.page)+"/"+t._s(Math.ceil(t.total/t.pagesize))+"页\n            ")]),t._v(" "),i("div",{staticClass:"page_right"},[i("Page",{attrs:{total:t.total,"page-size":t.pagesize,current:t.page},on:{"on-change":t.changePage}})],1)])],1),t._v(" "),i("Modal",{staticClass:"detail_box",attrs:{title:"咨询详情","footer-hide":!0,width:"600"},on:{"on-visible-change":function(e){return t.modalChange(e,"detail")}},model:{value:t.showDetail,callback:function(e){t.showDetail=e},expression:"showDetail"}},[i("div",{staticClass:"content"},[i("div",{staticClass:"single_info"},[i("p",{staticClass:"single_left"},[t._v("姓名：")]),t._v(" "),i("p",[t._v(t._s(t.editInfo.name))])]),t._v(" "),i("div",{staticClass:"single_info"},[i("p",{staticClass:"single_left"},[t._v("电话：")]),t._v(" "),i("p",[t._v(t._s(t.editInfo.phone))])]),t._v(" "),i("div",{staticClass:"single_info"},[i("p",{staticClass:"single_left"},[t._v("线路：")]),t._v(" "),i("p",[t._v(t._s(t.editInfo.route_text))])]),t._v(" "),i("div",{staticClass:"single_info"},[i("p",{staticClass:"single_left"},[t._v("班次：")]),t._v(" "),i("p",[t._v(t._s(t.editInfo.class))])]),t._v(" "),i("div",{staticClass:"single_info"},[i("p",{staticClass:"single_left"},[t._v("出发日期：")]),t._v(" "),i("p",[t._v(t._s(t.editInfo.ticket_time_string))])]),t._v(" "),i("div",{staticClass:"single_info"},[i("p",{staticClass:"single_left"},[t._v("人数：")]),t._v(" "),i("p",[t._v(t._s(t.editInfo.member_number)+"人")])]),t._v(" "),i("div",{staticClass:"single_info"},[i("p",{staticClass:"single_left"},[t._v("上车地址：")]),t._v(" "),i("p",[t._v(t._s(t.editInfo.start_name))])]),t._v(" "),i("div",{staticClass:"single_info"},[i("p",{staticClass:"single_left"},[t._v("下车地址：")]),t._v(" "),i("p",[t._v(t._s(t.editInfo.end_name))])]),t._v(" "),i("div",{staticClass:"single_info"},[i("p",{staticClass:"single_left"},[t._v("备注：")]),t._v(" "),t.editInfo.remark?i("p",[t._v(t._s(t.editInfo.remark))]):i("p",[t._v("无")])])])]),t._v(" "),i("Modal",{staticClass:"add_box",attrs:{"mask-closable":!1,closable:!1,width:"800",title:t.modalTitle},model:{value:t.showAdd,callback:function(e){t.showAdd=e},expression:"showAdd"}},[i("div",{staticClass:"content"},[i("div",{staticClass:"input_single"},[i("Input",{staticStyle:{width:"250px"},attrs:{placeholder:"客户姓名"},model:{value:t.editInfo.name,callback:function(e){t.$set(t.editInfo,"name",e)},expression:"editInfo.name"}}),t._v(" "),i("InputNumber",{staticClass:"number_input",staticStyle:{width:"250px"},attrs:{min:1,placeholder:"人数"},model:{value:t.editInfo.member_number,callback:function(e){t.$set(t.editInfo,"member_number",e)},expression:"editInfo.member_number"}})],1),t._v(" "),i("div",{staticClass:"input_single"},[i("Input",{staticStyle:{width:"250px"},attrs:{placeholder:"手机号码"},model:{value:t.editInfo.phone,callback:function(e){t.$set(t.editInfo,"phone",e)},expression:"editInfo.phone"}})],1),t._v(" "),i("div",{staticClass:"input_single"},[i("Select",{staticStyle:{width:"250px","margin-right":"40px"},attrs:{placeholder:"请选择路线"},on:{"on-change":function(e){return t.dateChange(e,"route")}},model:{value:t.editInfo.route,callback:function(e){t.$set(t.editInfo,"route",e)},expression:"editInfo.route"}},t._l(t.routeList,function(e){return i("Option",{key:e.value,attrs:{value:e.value}},[t._v(t._s(e.name))])}),1),t._v(" "),i("DatePicker",{staticStyle:{width:"250px","margin-right":"40px"},attrs:{value:t.editInfo.ticket_time,type:"date",options:t.options3,placeholder:"选择出发日期"},on:{"on-change":function(e){return t.dateChange(e,"date")}}})],1),t._v(" "),i("div",{staticClass:"input_single"},[i("Select",{ref:"resetSelect",staticStyle:{width:"250px","margin-right":"40px"},attrs:{clearable:"",placeholder:"请选择班次",disabled:!t.editInfo.route||!t.editInfo.ticket_time},model:{value:t.editInfo.class,callback:function(e){t.$set(t.editInfo,"class",e)},expression:"editInfo.class"}},t._l(t.timerList,function(e){return i("Option",{key:e.start_time,attrs:{value:e.start_time}},[t._v(t._s(e.class_text))])}),1),t._v(" "),i("Input",{staticStyle:{width:"400px"},attrs:{placeholder:"上车详细地址"},model:{value:t.editInfo.start_name,callback:function(e){t.$set(t.editInfo,"start_name",e)},expression:"editInfo.start_name"}})],1),t._v(" "),i("div",{staticClass:"input_single"},[i("Input",{staticStyle:{width:"400px","margin-left":"290px"},attrs:{placeholder:"下车详细地址"},model:{value:t.editInfo.end_name,callback:function(e){t.$set(t.editInfo,"end_name",e)},expression:"editInfo.end_name"}})],1),t._v(" "),i("div",{staticClass:"input_single"},[i("Input",{staticClass:"notice",attrs:{type:"textarea",placeholder:"备注"},model:{value:t.editInfo.remark,callback:function(e){t.$set(t.editInfo,"remark",e)},expression:"editInfo.remark"}})],1)]),t._v(" "),"咨询详情"!=t.modalTitle?i("div",{staticClass:"footer",attrs:{slot:"footer"},slot:"footer"},[i("Button",{staticClass:"cancle_btn",attrs:{type:"default"},on:{click:function(e){return t.cancleEdit("cancle")}}},[t._v("取消")]),t._v(" "),i("Button",{attrs:{type:"primary"},on:{click:function(e){return t.cancleEdit("edit")}}},[t._v("确定")])],1):t._e()]),t._v(" "),i("Modal",{staticClass:"delete_box",attrs:{"mask-closable":!1,closable:!1,width:"400"},model:{value:t.showDeleta,callback:function(e){t.showDeleta=e},expression:"showDeleta"}},[i("div",{staticClass:"content"},[i("p",[t._v("您确定要取消选中的咨询吗？")])]),t._v(" "),i("div",{staticClass:"footer",attrs:{slot:"footer"},slot:"footer"},[i("Button",{staticClass:"cancle_btn",attrs:{type:"default"},on:{click:function(e){return t.deleteArea("")}}},[t._v("取消")]),t._v(" "),i("Button",{attrs:{type:"primary"},on:{click:function(e){return t.bindDelete(t.deleteId,4)}}},[t._v("确定")])],1)])],1)},staticRenderFns:[]};var n=i("VU/8")(a,s,!1,function(t){i("h+l6")},null,null);e.default=n.exports}});
//# sourceMappingURL=33.10e3defe1717bb331fe1.js.map