export default {
    name: "index",
    data() {
        return {
            spanLeft: 5,
            spanRight: 19,
            menus: [],
            menuList: [ //菜单列表
                {
                    name: "管理中心",
                    path: "dataManagement",
                    state: 1,
                    icon: "ios-podium",
                    list: [
                        {
                            name: "数据统计",
                            path: "statistics",
                            state: 1
                        },
                        {
                            name: "城际库存操作台",
                            path: "intercityInventory",
                            state: 1
                        },
                        {
                            name: "调度中心",
                            path: "dispatchCenter",
                            state: 1
                        },
                        {
                            name:"景区快客库存操作台",
                            path: "codeBus",
                            state:1
                        }
                    ]
                },
                {
                    name: "基础配置",
                    path: "site",
                    state: 1,
                    icon: "ios-cog",
                    list: [
                        {
                            name: "站点配置",
                            path: "site",
                            state: 1
                        },
                        {
                            name: "线路配置",
                            path: "route",
                            state: 0
                        },
                        {
                            name: "司机配置",
                            path: "driver",
                            state: 0
                        },
                        {
                            name: "车辆配置",
                            path: "car",
                            state: 0
                        },
                        {
                            name: "佣金比例配置",
                            path: "commission",
                            state: 0
                        },
                        {
                            name: "取消规则配置",
                            path: "cancleRule",
                            state: 0
                        },
                        {
                            name: "改签规则配置",
                            path: "changeRule",
                            state: 0
                        },
                        {
                            name: "评价配置",
                            path: "comment",
                            state: 0
                        },
                        {
                            name: "城际班次配置",
                            path: "flightsList",
                            state: 0
                        },
                    ]
                },
                {
                    name: "订单中心",
                    path: "orderList",
                    state: 0,
                    icon: "md-paper",
                    list: [
                        {
                            name: "城际接送订单",
                            path: "orderList",
                            state: 0
                        },
                        {
                            name: "直通车订单",
                            path: "throughOrder",
                            state: 0
                        },
                        {
                            name:"景区快客订单",
                            path: "expressBusOrder",
                            state: 0
                        },
                        {
                            name:"周边游订单",
                            path:"travelAround",
                            state:0
                        },
                        {
                            name:'定制包车订单',
                            path:'customCharter',
                            state:0
                        }
                    ]
                },
                // {
                //     name: "短信配置",
                //     path: "messageList",
                //     state: 0,
                //     icon: "md-filing",
                //     list: []
                // },
                {
                    name: "防疫人员审核",
                    path: "preventionAuditList",
                    state: 0,
                    icon: "md-medkit",
                    list: []
                },
                // {
                //     name: "提现审核",
                //     path: "withdrawalAuditList",
                //     state: 0,
                //     icon: "logo-usd",
                //     list: []
                // },
                {
                    name: "区域配置",
                    path: "areaList",
                    state: 0,
                    icon: "ios-loading",
                    list: []
                },
                {
                    name: "营销中心",
                    path: "coupon",
                    state: 1,
                    icon: "md-basket",
                    list: [
                        {
                            name: "优惠卷",
                            path: "coupon",
                            state: 1
                        },
                        {
                            name: "新人礼包",
                            path: "newcomerPack",
                            state: 0
                        },
                        {
                            name: "推荐有礼",
                            path: "recommend",
                            state: 0
                        }

                    ]
                },
                {
                    name: "电话订票",
                    path: "phoneBooking",
                    state: 0,
                    icon: "ios-call",
                    list: []
                },
                {
                    name: "直通车",
                    path: "throughTrain",
                    state: 0,
                    icon: "ios-car",
                    list: [],
                },
                {
                    name: "用户中心",
                    path: "userCenter",
                    state: 0,
                    icon: "md-contacts",
                    list: []
                }, {
                    name: "分销模块",
                    path: "distributionModule",
                    state: 0,
                    icon: "md-qr-scanner",
                    list: [
                        {
                            name: "分销二维码",
                            path: "qrCode",
                            state: 0
                        },
                        {
                            name: "商家管理",
                            path: "merChant",
                            state: 0
                        }

                    ]
                },
                {
                    name: "旅游产品",
                    path: "productList",
                    state: 0,
                    icon: "md-paper",
                    list: [
                        {
                            name: "产品列表",
                            path: "productList",
                            state: 0
                        },
                    ]
                },
                {
                    name:'定制包车',
                    path:'customCharterList',
                    state:0,
                    icon:'ios-bus',
                    list:[
                        {
                            name:'车型列表',
                            path:'carList',
                            state:0
                        },
                        {
                            name:'定制服务',
                            path:'personalTailor',
                            state:0
                        }
                    ]
                },
                 {
                    name:'车辆调度',
                    path:'vehicleScheduling',
                    state:0,
                    icon:'md-car',
                    list:[
                        {
                            name:'车辆管理',
                            path:'carManage',
                            state:0
                        }
                    ]
                }
            ],
            user: {},
            editPwdModel: false, //修改密码的弹窗
            formInline: {
                old_password: '',
                new_password: ''
            }, //修改密码
            listarr: [],  // 面包屑列表容器
            routeList: []
        }
    },
    watch: {
        $route(val) {
            this.initNav(val.matched);
        },
        // $route() {   // 监听路由变化
        //     let arr = this.$route.matched
        //     console.log(arr)
        //     let arr1 = []
        //     // let html = `<span>></span>`
        //     arr.map((item, index) => {
        //         let obj = {}
        //         obj.title = item.meta.title
        //         obj.path = item.path
        //         arr1.push(obj)
        //     })
        //     this.listarr = arr1

        // }
    },

    created() {
        this.judgeMenuState();
        this.user = JSON.parse(localStorage.getItem("user"))
        this.initNav(this.$route.matched);
    },
    mounted() {  // 刷新时
        this.listarr = this.$route.matched
    },

    methods: {
        toLink(item) {
            this.$router.push({ name: item.name });
            this.judgeMenuState()
        },
        initNav(list) {
            this.routeList = [];
            for (let i of list) {
                if (i.meta.name) {
                    this.routeList.push(i);
                }
            }
        },
        judgeMenuState() {
            let name = this.$route.name;
            let index = 0;
            this.menuList.map((menu, menuIndex) => {
                if (menu.list.length > 0) {
                    menu.list.map((list, listIndex) => {
                        if (name === list.path) {
                            list.state = 1;
                            index = menuIndex;
                        } else {
                            menu.state = 0;
                            list.state = 0;
                        }
                    });
                } else {
                    if (name === "map" || name === "areaDetail") {
                        index = 4
                    }
                    if (name === "addFlights" || name === "modifyFlights") {
                        index = 1
                        this.menuList[index].list[8].state = 1
                    }
                    if (name === menu.path) {
                        index = menuIndex
                    }
                }
            });
            this.menuList[index].state = 1;
        },
        //退出登录
        quit() {
            this.$fetch("/admin/index/logout").then(res => {
                localStorage.removeItem("loginTK")
                if (res.code == 200) {
                    this.$router.push({
                        name: "login"
                    })
                    //推出登录成功，跳到登录页
                }
            });
        },
        //修改密码
        editPwdOk() {
            let old_password = this.formInline.old_password
            let new_password = this.formInline.new_password
            if (old_password && new_password) {
                //都填完，修改密码
                this.$form('/admin/index/change-password', {
                    old_password, new_password
                }).then(res => {
                    if (res.code == 200) {
                        this.$Message.info('修改密码成功')
                        this.editPwdModel = false
                        // 跳到登录页,重新登录
                        this.$router.push({
                            name: "login"
                        })
                    } else {
                        this.$Message.warning(res.error)
                    }
                })
            } else if (!old_password) {
                this.$Message.warning('请填写旧密码');
                return
            } else if (!new_password) {
                this.$Message.warning('请填写新密码');
                return
            }
        },
        cancel() {
            //取消按钮,清空旧密码和新密码
            this.formInline = {}
            this.editPwdModel = false
        },

        selMenu(item, index) {
            let state = this.menuList[index].state;
            for (let v of this.menuList) {
                v.state = 0;
                v.list.map(listItem => {
                    listItem.state = 0
                })
            }
            if (item.list.length === 0) {
                item.state = 1
            } else {
                item.state = state === 1 ? 0 : 1;
                if (item.state) {
                    item.list[0].state = 1
                }
            }
            this.$router.push({ name: item.path });
        },
        linkTo(listItem, index, listIndex) {
            for (let v of this.menuList) {
                let list = v.list;
                if (list.length > 0) {
                    for (let m of list) {
                        m.state = 0;
                    }
                }
            }
            listItem.state = 1;
            this.$router.push({ name: listItem.path });
        },

    },
}