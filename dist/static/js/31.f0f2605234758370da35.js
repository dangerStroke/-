webpackJsonp([31],{GeuM:function(t,e){},UAFA:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});a("BTaQ");var i={name:"list",data:function(){return{columns:[{title:"操作",slot:"action",align:"center",width:300},{type:"index",title:"序号",width:80,align:"center"},{title:"项目标题",key:"title"},{title:"项目价格",key:"priceStr"},{title:"项目图片",slot:"img"},{title:"项目详情",key:"details"}],listData:[],page:1,page_size:10,total:0,deleteId:"",showDeleta:!1}},created:function(){this.$Spin.show(),this.getList()},methods:{changePage:function(t){this.page=t,this.getList("page")},getList:function(t){var e=this;"page"!==t&&(this.page=1);var a={page:this.page,page_size:this.page_size};this.$fetch("/admin/throughtrain/gets",a).then(function(t){if(e.$Spin.hide(),200===t.code){e.total=t.data.total;var a=t.data.ret;a.map(function(t){t.priceStr=(Number(t.price)/100).toFixed(2)}),e.listData=a}else e.$Message.warning(t.error)}).catch(function(t){e.$Spin.hide(),e.$Message.warning("服务端异常")})},bindAdd:function(){this.$router.push({name:"trainAdd"})},bindDelete:function(){var t=this;this.$fetch("/admin/throughtrain/del",{id:this.deleteId}).then(function(e){t.$Spin.hide(),200===e.code?(e.data?t.$Message.success("删除成功"):t.$Message.warning("删除失败"),t.getList(""),t.deleteArea("")):t.$Message.warning(e.error)}).catch(function(e){t.$Spin.hide(),t.$Message.warning("服务端异常")})},deleteArea:function(t){t?(this.deleteId=t,this.showDeleta=!0):(this.showDeleta=!1,this.deleteId="")},trainDetail:function(t,e){this.$router.push({name:"trainDetail",query:{type:e,id:t.id}})}}},n={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"list_container"},[a("div",{staticClass:"btn_box"},[a("Button",{attrs:{type:"primary"},on:{click:t.bindAdd}},[a("Icon",{attrs:{type:"md-add"}}),t._v("新增\n        ")],1)],1),t._v(" "),a("div",{staticClass:"table_box"},[a("Table",{attrs:{border:"",columns:t.columns,data:t.listData},scopedSlots:t._u([{key:"img",fn:function(t){var e=t.row;return[a("div",{staticClass:"img_box"},[a("img",{attrs:{src:e.image,alt:""}})])]}},{key:"action",fn:function(e){var i=e.row;return[a("Button",{attrs:{type:"primary"},on:{click:function(e){return t.trainDetail(i,"detail")}}},[t._v("查看详情")]),t._v(" "),a("Button",{attrs:{type:"info"},on:{click:function(e){return t.trainDetail(i,"modify")}}},[t._v("修改")]),t._v(" "),a("Button",{attrs:{type:"error"},on:{click:function(e){return t.deleteArea(i.id)}}},[t._v("删除")])]}}])}),t._v(" "),a("div",{staticClass:"page_box"},[a("div",{staticClass:"page_left"},[t._v("\n                共"+t._s(t.total)+"条记录 第"+t._s(t.page)+"/"+t._s(Math.ceil(t.total/t.page_size))+"页\n            ")]),t._v(" "),a("div",{staticClass:"page_right"},[a("Page",{attrs:{total:t.total,"page-size":t.page_size,current:t.page},on:{"on-change":t.changePage}})],1)])],1),t._v(" "),a("Modal",{staticClass:"delete_box",attrs:{"mask-closable":!1,closable:!1,width:"400"},model:{value:t.showDeleta,callback:function(e){t.showDeleta=e},expression:"showDeleta"}},[a("div",{staticClass:"content"},[a("p",[t._v("您确定要删除选中项目吗？")])]),t._v(" "),a("div",{staticClass:"footer",attrs:{slot:"footer"},slot:"footer"},[a("Button",{staticClass:"cancle_btn",attrs:{type:"default"},on:{click:function(e){return t.deleteArea("")}}},[t._v("取消")]),t._v(" "),a("Button",{attrs:{type:"primary"},on:{click:t.bindDelete}},[t._v("确定")])],1)])],1)},staticRenderFns:[]};var s=a("VU/8")(i,n,!1,function(t){a("GeuM")},null,null);e.default=s.exports}});
//# sourceMappingURL=31.f0f2605234758370da35.js.map