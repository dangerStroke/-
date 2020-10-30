import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
// import Map from './views/map'

Vue.use(Router)


export default new Router({
  routes: [
    {
      path: "/",
      name: "login",
      component: () => import("./../views/login/")
    },
    {
      path: "/home",
      name: "home",
      meta: { name: '首页' },
      component: () => import("./../views/home/index.vue"), //页面
      redirect: {
        name: "dataManagement"
      },
      children: [
        {
          path: "/mapdemo",
          component: () => import("./../views/map/index.vue")
        },
        {
          path: "/dataManagement",
          name: "dataManagement",
          meta: { name: '数据管理中心' },
          component: () => import("./../views/dataManagement/index"), //数据管理中心
          redirect: {
            name: "statistics"
          },
          children: [
            {
              path: "statistics",
              name: "statistics",
              meta: { name: '数据统计' },
              component: () => import("./../views/dataManagement/statistics/index") // 数据统计
            },
            {
              path: "intercityInventory",
              name: "intercityInventory",
              meta: { name: '城际库存操作台' },
              component: () => import("./../views/dataManagement/intercityInventory/index") // 城际库存操作台
            },
            {
              path: "dispatchCenter",
              name: "dispatchCenter",
              meta: { name: '调度中心' },
              component: () => import("./../views/dataManagement/dispatchCenter/index") // 调度中心
            },
            {
              path:'codeBus',
              name:'codeBus',
              meta:{name:'景区快客库存操作台'},
              component: () => import("./../views/dataManagement/codeBus/index")
            }
          ]
        },

        {
          path: "setting",
          name: "setting",
          meta: { name: '基础配置' },
          component: () => import("./../views/basicSetting/index"), //基础配置主页面
          redirect: {
            name: "site"
          },
          children: [
            {
              path: "site",
              name: "site",
              meta: { name: '站点配置' },
              component: () => import("./../views/basicSetting/site"), //站点配置页面
            },
            {
              path: "route",
              name: "route",
              meta: { name: '路线配置' },
              component: () => import("./../views/basicSetting/route/index"), //路线配置页面
            },
            {
              path: "driver",
              name: "driver",
              meta: { name: '司机配置' },
              component: () => import("./../views/basicSetting/driver/index"), //司机配置页面
            },
            {
              path: "car",
              name: "car",
              meta: { name: '车辆配置' },
              component: () => import("./../views/basicSetting/car/index"), //车辆配置页面
            },
            {
              path: "commission",
              name: "commission",
              meta: { name: '佣金配置' },
              component: () => import("./../views/basicSetting/commission/index"), //佣金配置页面
            },
            {
              path: "cancleRule",
              name: "cancleRule",
              meta: { name: '取消规则配置' },
              component: () => import("./../views/basicSetting/cancleRule/index"), //取消规则配置页面
            },
            {
              path: "changeRule",
              name: "changeRule",
              meta: { name: '改签规则配置' },
              component: () => import("./../views/basicSetting/changeRule/index"), //改签规则配置页面
            },
            {
              path: "comment",
              name: "comment",
              meta: { name: '评价配置' },
              component: () => import("./../views/basicSetting/comment/index"), //评价配置页面
            },
            {
              path: "flights",
              name: "flights",
              meta: { name: '城际班次配置' },
              redirect: {
                name: "flightsList"
              },
              component: () => import("./../views/basicSetting/flights/index"), //城际班次配置页面
              children: [
                {
                  path: "flightsList",
                  name: "flightsList",
                  component: () => import("./../views/basicSetting/flights/list/"), //城际班次配置列表页面
                  meta: { name: '班次列表' },
                },
                {
                  path: "addFlights",
                  name: "addFlights",
                  component: () => import("./../views/basicSetting/flights/addFlights/"), //城际班次配置列表页面
                  meta: { name: '新建班次' },
                },
                {
                  path: "flightsEdit",
                  name: "flightsEdit",
                  component: () => import("./../views/basicSetting/flights/flightsEdit/"), //城际班次配置详情页面
                  meta: { name: '编辑班次' },
                },
                {
                  path: "modifyFlights",
                  name: "modifyFlights",
                  component: () => import("./../views/basicSetting/flights/modifyFlights/"), //城际班次配置修改页面
                  meta: { name: '班次详情' },
                },
              ]
            },
          ]
        },
        {
          path: "/order",
          name: "order",
          meta: { name: '订单中心' },
          component: () => import("./../views/order/index"), //订单中心页面
          redirect: {
            name: "orderList"
          },
          children: [
            {
              path: "orderList",
              name: "orderList",
              meta: { name: '城际接送订单' },
              component: () => import("./../views/order/list/")
            },
            {
              path: "throughOrder",
              name: "throughOrder",
              meta: { name: '直通车订单' },
              component: () => import("./../views/order/throughOrder/")
            },
            {
              path: "expressBusOrder",
              name: "expressBusOrder",
              meta: {name:'景区快客订单'},
              component: () => import("./../views/order/expressBusOrder/")
            },
            {
              path:"travelAround",
              name:"travelAround",
              meta: {name:"周边游订单"},
              component: () => import("../views/order/travelAround/")
            },
            {
              path:'customCharter',
              name:'customCharter',
              meta:{name:'定制包车订单'},
              component:() => import('../views/order/customCharter/')
            }
          ]
        },
        {
          path: "/messageSetting",
          name: "messageSetting",
          component: () => import("./../views/messageSetting/index"), //短信配置页面
          redirect: {
            name: "messageList"
          },
          children: [
            {
              path: "messageList",
              name: "messageList",
              component: () => import("./../views/messageSetting/list/")
            }
          ]
        },
        {
          path: "/preventionAudit",
          name: "preventionAudit",
          meta: { name: '防疫人员审核' },
          component: () => import("./../views/preventionAudit/index"), //防疫人员审核页面
          redirect: {
            name: "preventionAuditList"
          },
          children: [
            {
              path: "preventionAuditList",
              name: "preventionAuditList",
              meta: { name: '' },
              component: () => import("./../views/preventionAudit/list/")
            }
          ]
        },
        {
          path: "/withdrawalAudit",
          name: "withdrawalAudit",
          meta: { name: '提现审核' },
          component: () => import("./../views/withdrawalAudit/index"), //提现审核页面
          redirect: {
            name: "withdrawalAuditList"
          },
          children: [
            {
              path: "withdrawalAuditList",
              name: "withdrawalAuditList",
              meta: { name: '提现审核' },
              component: () => import("./../views/withdrawalAudit/list/")
            }
          ]
        },
        {
          path: "/areaSetting",
          name: "areaSetting",
          meta: { name: '区域配置' },
          component: () => import("./../views/areaSetting/index"), //区域配置页面
          redirect: {
            name: "areaList"
          },
          children: [
            {
              path: "areaList",
              name: "areaList",
              meta: { name: '' },
              component: () => import("./../views/areaSetting/list/"),
              meta: { name: '区域列表' },
            },
            {
              path: "map",
              name: "map",
              component: () => import("./../views/areaSetting/map/"),
              meta: { name: '区域配置' },
            },
            {
              path: "areaDetail/:id",
              name: "areaDetail",
              component: () => import("./../views/areaSetting/areaDetail/"),
              meta: { name: '区域详情' },
            }
          ]
        },
        {
          path: "/marketingCenter",
          name: "marketingCenter",
          meta: { name: '营销中心配置' },
          component: () => import("./../views/marketingCenter/index"), //营销中心配置页面
          redirect: {
            name: "coupon"
          },
          children: [
            {
              path: "coupon",
              name: "coupon",
              meta: { name: '优惠卷配置' },
              component: () => import("./../views/marketingCenter/coupon/index") // 优惠卷
            },
            {
              path: "newcomerPack",
              name: "newcomerPack",
              meta: { name: '新人礼包配置' },
              component: () => import("./../views/marketingCenter/newcomerPack/index") //新人礼包
            },
            {
              path: "recommend",
              name: "recommend",
              meta: { name: '推荐有礼配置' },
              component: () => import("./../views/marketingCenter/recommend/index") //推荐有礼
            }
          ]
        },
        {
          path: "/phoneBooking",
          name: "phoneBooking",
          component: () => import("./../views/phoneBooking/index"), //区域配置页面
          redirect: {
            name: "bookingList"
          },
          children: [
            {
              path: "bookingList",
              name: "bookingList",
              component: () => import("./../views/phoneBooking/bookingList/"),
              meta: { name: '电话订票' },
            }
          ]
        },
        {
          path: "/throughTrain",
          name: "throughTrain",
          component: () => import("./../views/throughTrain/index"), //区域配置页面
          meta: { name: '直通车' },
          redirect: {
            name: "trainList"
          },
          children: [
            {
              path: "trainList",
              name: "trainList",
              component: () => import("./../views/throughTrain/trainList/"),
              meta: { name: '直通车列表' },
            },
            {
              path: "trainAdd",
              name: "trainAdd",
              component: () => import("./../views/throughTrain/trainAdd/"),
              meta: { name: '添加项目' },
            },
            {
              path: "trainDetail",
              name: "trainDetail",
              component: () => import("./../views/throughTrain/trainDetail/"),
              meta: { name: '项目详情' },
            }
          ]
        },
        {
          path: "/userCenter",
          name: "userCenter",
          meta: { name: '用户中心' },
          component: () => import("./../views/userCenter/index"), //用户中心页面
          redirect: {
            name: "userCenterList"
          },
          children: [
            {
              path: "userCenterList",
              name: "userCenterList",
              meta: { name: '用户列表' },
              component: () => import("./../views/userCenter/list/"),
              children:[
                {
                  path: "userCoupon/:id",
                  name: "userCoupon",
                  component: () => import("./../views/userCenter/userCoupon/"),
                  meta: { name: '优惠卷' },
                },
                {
                  path: "orderHistory/:id",
                  name: "orderHistory",
                  component: () => import("./../views/userCenter/orderHistory/"),
                  meta: { name: '订单记录' },
                },{
                  path: "commonAddress/:id",
                  name: "commonAddress",
                  component: () => import("./../views/userCenter/commonAddress/"),
                  meta: { name: '常用地址' }
                }

              ]
            },
            
          ]
        },
        {
          path: "/distributionModule",
          name: "distributionModule",
          meta: { name: '分销模块' },
          component: () => import("./../views/distributionModule/index"), //分销模块页面
          redirect: {
            name: "qrCode"
          },
          children: [
            {
              path: "qrCode",
              name: "qrCode",
              meta: { name: '分销二维码' },
              component: () => import("./../views/distributionModule/qrCode/"),
            },
            {
              path: "merChant",
              name: "merChant",
              meta: { name: '商家管理' },
              component: () => import("./../views/distributionModule/merChant/"),
            },
            
          ]
        },
        {
          path: "/intercityOrder",
          name: "intercityOrder",
          meta: { name: '城际包车订单' },
          component: () => import("./../views/intercityOrder/index"), //订单中心页面
          redirect: {
            name: "intercityOrderList"
          },
          children: [
            {
              path: "intercityOrderList",
              name: "intercityOrderList",
              meta: { name: '' },
              component: () => import("./../views/intercityOrder/list/")
            }
          ]
        },
        {
          path: "/travelProduct",
          name: "travelProduct",
          meta: { name: '旅游产品' },
          component: () => import("./../views/travelProduct/index"), 
          redirect: {
            name: "productList"
          },
          children: [
            {
              path: "productList",
              name: "productList",
              meta: { name: '' },
              component: () => import("./../views/travelProduct/productList/"),
              meta: { name: '产品列表' },
            },
            {
              path: "addProduct",
              name: "addProduct",
              component: () => import("./../views/travelProduct/addProduct/"),
              meta: { name: '添加产品' },
            },
          ]
        },
        {
          path:'/customCharterList',
          name:'customCharterList',
          meta:{name:'定制包车'},
          component:() => import('./../views/customCharter/index'),
          redirect: {
            name:'carList'
          },
          children: [
            {
              path:'carList',
              name:'carList',
              meta: {name:"添加定制包车"},
              component: () => import('./../views/customCharter/carList/')
            },
            {
              path:'personalTailor',
              name:'personalTailor',
              meta: {name:"定制服务"},
              component: () => import('./../views/customCharter/personalTailor/')
            }
          ]
        },
        {
          path:'/vehicleScheduling',
          name:'vehicleScheduling',
          meta:{name:'车辆调度'},
          component: () => import ('./../views/dispatch/index'),
          redirect: {
            name:'carManage'
          },
          children: [
            {
              path:'carDispatch',
              name:'carDispatch',
              meta:{name:'车辆订单管理'},
              component: () => import('./../views/dispatch/carDispatch/index')
            },
            {
              path:'carManage',
              name:'carManage',
              meta:{name:'车辆详情'},
              component: () => import('./../views/dispatch/carManage/index')
            }
          ]
        }
      ]
    },
    {
      path: '/404',//404页面
      name: 'notFound',
      component: () => import("./../views/notFound/")
    },
    {
      path: '*',
      redirect: '/404'
    }
  ]
})

