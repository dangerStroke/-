webpackJsonp([3],{BO1k:function(t,e,a){t.exports={default:a("fxRn"),__esModule:!0}},KR8f:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var s=a("BO1k"),n=a.n(s),i={name:"index",data:function(){return{spanLeft:5,spanRight:19,menus:[],menuList:[{name:"管理中心",path:"dataManagement",state:1,icon:"ios-podium",list:[{name:"数据统计",path:"statistics",state:1},{name:"城际库存操作台",path:"intercityInventory",state:1},{name:"调度中心",path:"dispatchCenter",state:1},{name:"景区快客库存操作台",path:"codeBus",state:1}]},{name:"基础配置",path:"site",state:1,icon:"ios-cog",list:[{name:"站点配置",path:"site",state:1},{name:"线路配置",path:"route",state:0},{name:"司机配置",path:"driver",state:0},{name:"车辆配置",path:"car",state:0},{name:"佣金比例配置",path:"commission",state:0},{name:"取消规则配置",path:"cancleRule",state:0},{name:"改签规则配置",path:"changeRule",state:0},{name:"评价配置",path:"comment",state:0},{name:"城际班次配置",path:"flightsList",state:0}]},{name:"订单中心",path:"orderList",state:0,icon:"md-paper",list:[{name:"城际接送订单",path:"orderList",state:0},{name:"直通车订单",path:"throughOrder",state:0},{name:"景区快客订单",path:"expressBusOrder",state:0},{name:"周边游订单",path:"travelAround",state:0},{name:"定制包车订单",path:"customCharter",state:0}]},{name:"防疫人员审核",path:"preventionAuditList",state:0,icon:"md-medkit",list:[]},{name:"区域配置",path:"areaList",state:0,icon:"ios-loading",list:[]},{name:"营销中心",path:"coupon",state:1,icon:"md-basket",list:[{name:"优惠卷",path:"coupon",state:1},{name:"新人礼包",path:"newcomerPack",state:0},{name:"推荐有礼",path:"recommend",state:0}]},{name:"电话订票",path:"phoneBooking",state:0,icon:"ios-call",list:[]},{name:"直通车",path:"throughTrain",state:0,icon:"ios-car",list:[]},{name:"用户中心",path:"userCenter",state:0,icon:"md-contacts",list:[]},{name:"分销模块",path:"distributionModule",state:0,icon:"md-qr-scanner",list:[{name:"分销二维码",path:"qrCode",state:0},{name:"商家管理",path:"merChant",state:0}]},{name:"旅游产品",path:"productList",state:0,icon:"md-paper",list:[{name:"产品列表",path:"productList",state:0}]},{name:"定制包车",path:"customCharterList",state:0,icon:"ios-bus",list:[{name:"车型列表",path:"carList",state:0},{name:"定制服务",path:"personalTailor",state:0}]},{name:"车辆调度",path:"vehicleScheduling",state:0,icon:"md-car",list:[{name:"车辆管理",path:"carManage",state:0}]}],user:{},editPwdModel:!1,formInline:{old_password:"",new_password:""},listarr:[],routeList:[]}},watch:{$route:function(t){this.initNav(t.matched)}},created:function(){this.judgeMenuState(),this.user=JSON.parse(localStorage.getItem("user")),this.initNav(this.$route.matched)},mounted:function(){this.listarr=this.$route.matched},methods:{toLink:function(t){this.$router.push({name:t.name}),this.judgeMenuState()},initNav:function(t){this.routeList=[];var e=!0,a=!1,s=void 0;try{for(var i,r=n()(t);!(e=(i=r.next()).done);e=!0){var o=i.value;o.meta.name&&this.routeList.push(o)}}catch(t){a=!0,s=t}finally{try{!e&&r.return&&r.return()}finally{if(a)throw s}}},judgeMenuState:function(){var t=this,e=this.$route.name,a=0;this.menuList.map(function(s,n){s.list.length>0?s.list.map(function(t,i){e===t.path?(t.state=1,a=n):(s.state=0,t.state=0)}):("map"!==e&&"areaDetail"!==e||(a=4),"addFlights"!==e&&"modifyFlights"!==e||(a=1,t.menuList[a].list[8].state=1),e===s.path&&(a=n))}),this.menuList[a].state=1},quit:function(){var t=this;this.$fetch("/admin/index/logout").then(function(e){localStorage.removeItem("loginTK"),200==e.code&&t.$router.push({name:"login"})})},editPwdOk:function(){var t=this,e=this.formInline.old_password,a=this.formInline.new_password;if(e&&a)this.$form("/admin/index/change-password",{old_password:e,new_password:a}).then(function(e){200==e.code?(t.$Message.info("修改密码成功"),t.editPwdModel=!1,t.$router.push({name:"login"})):t.$Message.warning(e.error)});else{if(!e)return void this.$Message.warning("请填写旧密码");if(!a)return void this.$Message.warning("请填写新密码")}},cancel:function(){this.formInline={},this.editPwdModel=!1},selMenu:function(t,e){var a=this.menuList[e].state,s=!0,i=!1,r=void 0;try{for(var o,l=n()(this.menuList);!(s=(o=l.next()).done);s=!0){var c=o.value;c.state=0,c.list.map(function(t){t.state=0})}}catch(t){i=!0,r=t}finally{try{!s&&l.return&&l.return()}finally{if(i)throw r}}0===t.list.length?t.state=1:(t.state=1===a?0:1,t.state&&(t.list[0].state=1)),this.$router.push({name:t.path})},linkTo:function(t,e,a){var s=!0,i=!1,r=void 0;try{for(var o,l=n()(this.menuList);!(s=(o=l.next()).done);s=!0){var c=o.value.list;if(c.length>0){var d=!0,u=!1,m=void 0;try{for(var h,p=n()(c);!(d=(h=p.next()).done);d=!0){h.value.state=0}}catch(t){u=!0,m=t}finally{try{!d&&p.return&&p.return()}finally{if(u)throw m}}}}}catch(t){i=!0,r=t}finally{try{!s&&l.return&&l.return()}finally{if(i)throw r}}t.state=1,this.$router.push({name:t.path})}}},r={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"home_container"},[a("div",{staticClass:"layout"},[a("Layout",[a("Header",{staticClass:"layout-header-bar"},[a("div",{staticClass:"header-wapper"},[a("div",{staticClass:"header-left"},[a("div",{staticClass:"header-left-avatar"},[a("Avatar",{attrs:{icon:"ios-person",size:"large"}}),t._v(" "),a("span",{staticClass:"user-name"},[t._v(t._s(t.user.nickname))])],1),t._v(" "),a("span",{staticClass:"header-title"},[t._v("极地运业后台管理系统")])]),t._v(" "),a("div",{staticClass:"header-right"},[a("div",{staticClass:"btn-blue",attrs:{type:"text",icon:"md-exit",size:"large"}},[a("div",{staticClass:"editUser",on:{click:function(e){t.editPwdModel=!0}}},[a("Icon",{staticClass:"exit_icon",attrs:{type:"md-exit"}}),t._v("修改密码\n              ")],1),t._v(" "),a("div",{staticClass:"editUser",on:{click:t.quit}},[a("Icon",{staticClass:"exit_icon",attrs:{type:"md-power"}}),t._v("退出系统\n              ")],1)])])])]),t._v(" "),a("Modal",{attrs:{title:"修改密码","mask-closable":!1,closable:!1},model:{value:t.editPwdModel,callback:function(e){t.editPwdModel=e},expression:"editPwdModel"}},[a("Form",{ref:"formInline",attrs:{model:t.formInline}},[a("FormItem",{attrs:{prop:"old_password",required:"",label:"旧密码"}},[a("Input",{attrs:{type:"password",placeholder:"旧密码"},model:{value:t.formInline.old_password,callback:function(e){t.$set(t.formInline,"old_password",e)},expression:"formInline.old_password"}})],1),t._v(" "),a("FormItem",{attrs:{prop:"new_password",required:"",label:"新密码"}},[a("Input",{attrs:{type:"password",placeholder:"新密码"},model:{value:t.formInline.new_password,callback:function(e){t.$set(t.formInline,"new_password",e)},expression:"formInline.new_password"}})],1)],1),t._v(" "),a("div",{attrs:{slot:"footer"},slot:"footer"},[a("Button",{attrs:{type:"text",size:"large"},on:{click:t.cancel}},[t._v("取消")]),t._v(" "),a("Button",{attrs:{type:"primary",size:"large"},on:{click:t.editPwdOk}},[t._v("确定")])],1)],1),t._v(" "),a("Layout",[a("Sider",{style:{background:"#fff"},attrs:{"hide-trigger":""}},[a("div",{staticClass:"menuItem"},t._l(t.menuList,function(e,s){return a("div",{key:s,staticClass:"itemGroup",class:e.state?"act":""},[a("div",{staticClass:"item",on:{click:function(a){return t.selMenu(e,s)}}},[a("div",{staticClass:"itemIcon"},[a("Icon",{class:e.state?"activeIcon":"",attrs:{type:e.icon,size:"22"}}),t._v(" "),a("span",[t._v(t._s(e.name))])],1),t._v(" "),e.list.length>0&&!e.state?a("Icon",{class:e.state?"activeIcon":"",attrs:{type:"ios-arrow-forward",size:"18"}},[t._v(">")]):t._e(),t._v(" "),e.list.length>0&&e.state?a("Icon",{class:e.state?"activeIcon":"",attrs:{type:"ios-arrow-down",size:"18"}}):t._e()],1),t._v(" "),a("div",{staticClass:"itemList"},t._l(e.list,function(e,n){return a("p",{key:n,class:e.state?"active_submenu":"normal_submenu",on:{click:function(a){return t.linkTo(e,s,n)}}},[t._v(t._s(e.name))])}),0)])}),0)]),t._v(" "),a("div",{staticClass:"right_content"},[a("div",{staticClass:"bread_box"},t._l(t.routeList,function(e,s){return"home"!==e.name?a("span",{key:s,style:{color:s===t.routeList.length-1?"#18AFFF":"rgba(0,0,0,0.65)"},on:{click:function(a){return t.toLink(e)}}},[t._v("\n              "+t._s(e.meta.name)+"\n              "),s!==t.routeList.length-1?a("span",{staticStyle:{padding:"0 5px"}},[t._v("/")]):t._e()]):t._e()}),0),t._v(" "),a("Layout",{style:{padding:"24px 24px 24px",width:"100%"}},[a("Content",{style:{padding:"24px",height:"100%",background:"#fff"}},[a("router-view")],1)],1)],1)],1)],1)],1)])},staticRenderFns:[]};var o=a("VU/8")(i,r,!1,function(t){a("WG6t")},"data-v-503aec6c",null);e.default=o.exports},WG6t:function(t,e){},fxRn:function(t,e,a){a("+tPU"),a("zQR9"),t.exports=a("g8Ux")},g8Ux:function(t,e,a){var s=a("77Pl"),n=a("3fs2");t.exports=a("FeBl").getIterator=function(t){var e=n(t);if("function"!=typeof e)throw TypeError(t+" is not iterable!");return s(e.call(t))}}});
//# sourceMappingURL=3.ada9537d9a2ef6971ade.js.map