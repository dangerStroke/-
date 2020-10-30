webpackJsonp([12],{G5u5:function(t,e){},qZzx:function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});i("G5u5");var a={name:"route",data:function(){return{columns12:[{title:"线路编号",key:"id",align:"center"},{title:"起始站点",key:"station1_name",align:"center"},{title:"终止站点",key:"station2_name",align:"center"},{title:"线路价格",key:"priceText",align:"center"},{title:"儿童价",key:"child_price",align:"center"},{title:"线路原价",key:"originPrice",align:"center"},{title:"操作",slot:"action",width:150,align:"center"}],formLeft:{routeId:"",siteStart:"",siteEnd:"",sitePrice:""},showEdit:!1,title:"新建路线",page:1,pagesize:10,total:0,routeList:[],stationList:[],editInfo:{id:"",station1:null,station2:null,price:null,child_price:null,adult_original_price:null},showDelete:!1,deleteId:""}},created:function(){this.$Spin.show(),this.getRouteList(""),this.getStation()},methods:{changePage:function(t){this.page=t,this.getRouteList("page")},submitDelete:function(){var t=this;this.$fetch("admin/citytransport/del-route?id="+this.deleteId).then(function(e){t.$Spin.hide(),t.deleteModalChange("hide",""),200===e.code?(t.$Message.success("删除成功"),t.getRouteList("")):t.$Message.warning(e.error)}).catch(function(e){t.$Spin.hide()})},deleteModalChange:function(t,e){"show"===t?(this.deleteId=e,this.showDelete=!0):(this.deleteId="",this.showDelete=!1)},editRoute:function(){var t=this;console.log(this.editInfo.child_price);var e="";if(this.editInfo.station1)if(this.editInfo.station2)if(this.editInfo.price)if(this.editInfo.child_price)if(this.editInfo.adult_original_price){var i=this.editInfo,a="";"新建路线"===this.title?(i.id="",a="admin/citytransport/add-route",e="添加成功"):(a="admin/citytransport/edit-route",e="修改成功"),i.price=1e6*Number(this.editInfo.price)/1e4,i.child_price=1e6*Number(this.editInfo.child_price)/1e4,i.adult_original_price=1e6*Number(this.editInfo.adult_original_price)/1e4,this.$post(a,i).then(function(i){t.$Spin.hide(),200===i.code?t.$Message.success(e):t.$Message.warning(i.error),t.getRouteList(""),t.modalChange("add","cancle",{})}).catch(function(e){t.$Spin.hide()})}else this.$Message.warning("请填写线路原价");else this.$Message.warning("请填写儿童价");else this.$Message.warning("请填写线路价格");else this.$Message.warning("请选择终止站点");else this.$Message.warning("请选择起始站点")},modalChange:function(t,e,i){this.title="add"===t?"新建路线":"编辑路线","cancle"===e?(this.showEdit=!1,this.editInfo={station1:null,station2:null,price:null,child_price:null,adult_original_price:null}):(this.showEdit=!0,i&&(this.editInfo.id=i.id,this.editInfo.station1=i.station1,this.editInfo.station2=i.station2,this.editInfo.price=i.priceText,this.editInfo.adult_original_price=i.originPrice,this.editInfo.child_price=i.child_price))},getStation:function(){var t=this;this.$fetch("/admin/index/select-station").then(function(e){if(t.$Spin.hide(),200===e.code&&e.data){var i=e.data,a=[];for(var s in i){var n={name:i[s],value:Number(s)};a.push(n)}t.stationList=a}}).catch(function(e){t.$Spin.hide()})},getRouteList:function(t){var e=this;"page"!==t&&(this.page=1);var i={page:this.page,pagesize:this.pagesize};this.$fetch("admin/citytransport/list-route",i).then(function(t){if(e.$Spin.hide(),200===t.code){e.total=t.data.total;var i=t.data.data;i.map(function(t){t.priceText=(Number(t.price)/100).toFixed(2),t.child_price=(Number(t.child_price)/100).toFixed(2),t.originPrice=(Number(t.adult_original_price)/100).toFixed(2)}),e.routeList=i}else e.$Message.warning(t.error)}).catch(function(t){e.$Spin.hide()})}}},s={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",[i("div",{staticClass:"new_site"},[i("Button",{attrs:{type:"primary"},on:{click:function(e){return t.modalChange("add","add")}}},[i("Icon",{attrs:{type:"md-add"}}),t._v("新建")],1)],1),t._v(" "),i("div",{staticClass:"table_box"},[i("Table",{attrs:{border:"",columns:t.columns12,data:t.routeList},scopedSlots:t._u([{key:"action",fn:function(e){var a=e.row;return e.index,[i("Button",{staticStyle:{"margin-right":"5px"},attrs:{type:"primary",size:"small"},on:{click:function(e){return t.modalChange("edit","edit",a)}}},[t._v("修改")]),t._v(" "),i("Button",{attrs:{type:"error",size:"small"},on:{click:function(e){return t.deleteModalChange("show",a.id)}}},[t._v("删除")])]}}])}),t._v(" "),i("div",{staticClass:"page_box"},[i("div",{staticClass:"page_left"},[t._v("\n                  共"+t._s(t.total)+"条记录 第"+t._s(t.page)+"/"+t._s(Math.ceil(t.total/t.pagesize))+"页\n              ")]),t._v(" "),i("div",{staticClass:"page_right"},[i("Page",{attrs:{total:t.total,"page-size":t.pagesize,current:t.page},on:{"on-change":t.changePage}})],1)])],1),t._v(" "),i("Modal",{staticClass:"edit_modal",attrs:{title:t.title,"mask-closable":!1,closable:!1},model:{value:t.showEdit,callback:function(e){t.showEdit=e},expression:"showEdit"}},[i("div",{staticClass:"edit_box"},[i("div",{staticClass:"edit_single"},[i("p",[i("span",{staticClass:"inclued"},[t._v("*")]),t._v("起始站点：")]),t._v(" "),i("Select",{staticStyle:{width:"200px"},attrs:{placeholder:"请选择路线",disabled:"编辑路线"===t.title},model:{value:t.editInfo.station1,callback:function(e){t.$set(t.editInfo,"station1",e)},expression:"editInfo.station1"}},t._l(t.stationList,function(e){return i("Option",{key:e.value,attrs:{value:e.value}},[t._v(t._s(e.name))])}),1)],1),t._v(" "),i("div",{staticClass:"edit_single"},[i("p",[i("span",{staticClass:"inclued"},[t._v("*")]),t._v("终止站点：")]),t._v(" "),i("Select",{staticStyle:{width:"200px"},attrs:{placeholder:"请选择路线",disabled:"编辑路线"===t.title},model:{value:t.editInfo.station2,callback:function(e){t.$set(t.editInfo,"station2",e)},expression:"editInfo.station2"}},t._l(t.stationList,function(e){return i("Option",{key:e.value,attrs:{value:e.value}},[t._v(t._s(e.name))])}),1)],1),t._v(" "),i("div",{staticClass:"edit_single"},[i("p",[i("span",{staticClass:"inclued"},[t._v("*")]),t._v("路线价格：")]),t._v(" "),i("Input",{staticStyle:{width:"200px"},attrs:{type:"number"},model:{value:t.editInfo.price,callback:function(e){t.$set(t.editInfo,"price",e)},expression:"editInfo.price"}}),t._v(" "),i("p",{staticClass:"price_text"},[t._v("元")])],1),t._v(" "),i("div",{staticClass:"edit_single"},[i("p",[i("span",{staticClass:"inclued"},[t._v("*")]),t._v("儿童价：")]),t._v(" "),i("Input",{staticStyle:{width:"200px"},attrs:{type:"number"},model:{value:t.editInfo.child_price,callback:function(e){t.$set(t.editInfo,"child_price",e)},expression:"editInfo.child_price"}}),t._v(" "),i("p",{staticClass:"price_text"},[t._v("元")])],1),t._v(" "),i("div",{staticClass:"edit_single"},[i("p",[i("span",{staticClass:"inclued"},[t._v("*")]),t._v("路线原价：")]),t._v(" "),i("Input",{staticStyle:{width:"200px"},attrs:{type:"number"},model:{value:t.editInfo.adult_original_price,callback:function(e){t.$set(t.editInfo,"adult_original_price",e)},expression:"editInfo.adult_original_price"}}),t._v(" "),i("p",{staticClass:"price_text"},[t._v("元")])],1)]),t._v(" "),i("div",{staticClass:"footer",attrs:{slot:"footer"},slot:"footer"},[i("Button",{staticClass:"cancle_btn",attrs:{type:"default"},on:{click:function(e){return t.modalChange("add","cancle")}}},[t._v("取消")]),t._v(" "),i("Button",{attrs:{type:"primary"},on:{click:t.editRoute}},[t._v("确定")])],1)]),t._v(" "),i("Modal",{staticClass:"delete_box",attrs:{"mask-closable":!1,closable:!1,width:"400"},model:{value:t.showDelete,callback:function(e){t.showDelete=e},expression:"showDelete"}},[i("div",{staticClass:"content"},[i("p",[t._v("您确定要删除选中线路吗？")])]),t._v(" "),i("div",{staticClass:"footer",attrs:{slot:"footer"},slot:"footer"},[i("Button",{staticClass:"cancle_btn",attrs:{type:"default"},on:{click:function(e){return t.deleteModalChange("cancle","")}}},[t._v("取消")]),t._v(" "),i("Button",{attrs:{type:"primary"},on:{click:t.submitDelete}},[t._v("确定")])],1)])],1)},staticRenderFns:[]};var n=i("VU/8")(a,s,!1,function(t){i("yg2V")},"data-v-48173bb8",null);e.default=n.exports},yg2V:function(t,e){}});
//# sourceMappingURL=12.cec5d37bd93fea948665.js.map