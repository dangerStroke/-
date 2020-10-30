import expandRow from './childrenItem.vue';
export default {
    name: "list",
    data() {
        return {
            routeName: "",
            route_id: "",
            car_id: "",
            driver_id: "",
            routeList: [],
            carList: [],
            driverList: [],
            columns: [
                {
                    type: "index",
                    title: "序号",
                    width: 80,
                    align: "center"
                },
                {
                    title: '线路',
                    key: 'name',
                    align: "center"
                },
                {
                    title: '司机',
                    key: 'age',
                    align: "center"
                },
                {
                    title: '城际车辆',
                    key: 'address',
                    align: "center"
                },
                {
                    title: "操作",
                    slot: "action",
                    align: "center",
                    width: 300
                }
            ],
            columns10: [
                {
                    type: 'expand',
                    width: 50,
                    render: (h, params) => {
                        return h(expandRow, {
                            props: {
                                row: params.row,
                                route_id: params.row.station_route_id
                            },
                            on: {
                                removeList: (row, id) => {
                                    this.deleteRecord(row, id)
                                },
                                editList: (row,type,route_id) => {
                                    this.modifyList(row,type,route_id)

                                },
                                flashData: () => {
                                    this.getTimerList("");
                                }
                            }
                        })
                    }
                },
                {
                    title: '线路',
                    slot: 'station'
                },
                {
                    title: '城际车辆',
                    slot: 'car'
                },
                {
                    title: '司机',
                    slot: 'driver'
                },
                {
                    title: '操作',
                    slot: 'action',
                    align: "center",
                    width: 180
                }
            ],
            listData: [],
            page: 1,
            page_size: 10,
            total: 0,
            deleteInfo: {},
            showDelete: false,
        }
    },
    created() {
        this.$Spin.show();
        this.getRouteList()
        this.getCarList()
        this.getDriverList()
        this.getTimerList("")
    },
    methods: {
        modelChange(type) {
            if (type === "open") {
                this.showDelete = true
            } else {
                if (type === "confirm") {
                    this.submitDelete()
                }
                this.showDelete = false
                this.showDelete = false
            }
        },
        // 修改车辆班次
        modifyList (row,type,route_id) {
            this.getCarTimers(route_id,row.id,type)

        },
        // 获取单个车辆班次信息
        getCarTimers (route_id,car_id,type) {
            this.$fetch(`admin/classes/get?route_id=${route_id}&car_id=${car_id}`).then(res => {
                if (res.code === 200) {
                    if (res.data.is_update || type === 'detail') {
                        this.$router.push({
                            name: "modifyFlights",
                            query: {
                                type: type,
                                route_id: route_id,
                                car_id: car_id
                            }
                        })
                    } else {
                        this.$Message.warning("当前车辆存在未完成订单")
                    }
                } else {
                    this.$Message.warning(res.error)
                }
            })
        },
        // 删除班次
        deleteRecord(row, id) {
            let params = {
                route_id: row.id
            }
            if (id) {
                params.car_id = id
                params.route_id = row.id
            }
            this.deleteInfo = params
            this.modelChange("open")
        },
        // 确认删除
        submitDelete() {
            this.$post('admin/classes/del', this.deleteInfo).then(res => {
                if (res.code === 200) {
                    this.$Message.success("删除成功")
                    this.getTimerList("")
                } else {
                    this.$Message.warning(res.error)
                }
                this.modelChange("cancle")
            })
                .catch(res => {
                    this.$Spin.hide();
                    // this.$Message.warning("服务端异常")
                })
        },
        // 详情、修改
        bindDetail(type, row) {
            localStorage.setItem("flights", JSON.stringify(row))
            this.$router.push({
                name: "flightsEdit",
                query: {
                    type: type
                }
            })
        },
        // 清空搜索条件
        initData() {
            this.route_id = ""
            this.car_id = ""
            this.driver_id = ""
            this.getTimerList("")
        },
        // 获取班次列表
        getTimerList(type) {
            let { route_id, car_id, driver_id } = this
            if (type !== "page") {
                this.page = 1
            }
            let params = {
                page: this.page,
                page_size: this.page_size,
                route_id,
                car_id,
                driver_id
            }
            this.$fetch('admin/classes/gets', params).then(res => {
                if (res.code === 200) {
                    // this.listData = res.data.timers
                    this.listData = res.data.routes
                    this.total = res.data.total
                } else {
                    this.$Message.warning(res.error)
                }
            })
                .catch(res => {
                    this.$Spin.hide();
                    // this.$Message.warning("服务端异常")
                })
        },
        // 新增班次
        addFlights() {
            // this.$router.push({
            //     name: "timerAdd"
            // })
            this.$router.push({
                name: "addFlights"
            })
        },
        // 获取司机列表
        getDriverList() {
            this.$fetch(`/admin/index/select-driver`).then(res => {
                if (res.data) {
                    let data = res.data
                    let driverList = []
                    for (let key in data) {
                        let obj = {
                            name: data[key],
                            value: key
                        }
                        driverList.push(obj)
                    }
                    this.driverList = driverList
                }
            })
                .catch(res => {
                    this.$Spin.hide();
                    // this.$Message.warning("服务端异常")
                })

            // this.$fetch('/admin/dispatch/list-driver').then(res => {
            //     this.$Spin.hide();
            //     if (res.code === 200) {
            //         // console.log(res.data.data)
            //         let arr = []
            //         res.data.data.map((item, index) => {
            //             // console.log(item)
            //             if (item.status == 1) {
            //                 arr.push(item)
            //             }
            //         })
            //         console.log(arr)
            //         let driverList = []
            //         for (let key in arr) {
            //             let obj = {
            //                 name: arr[key].name,
            //                 value: key
            //             }
            //             driverList.push(obj)
            //         }
            //         this.driverList = driverList
            //     } else {
            //         this.$Message.warning(res.error)
            //     }
            // }).catch(err => {
            //     this.$Spin.hide();
            //     this.$Message.warning("服务器端异常")
            // })



        },
        // 获取车辆列表
        getCarList() {
            this.$fetch(`/admin/index/select-car`).then(res => {
                if (res.data) {
                    let data = res.data
                    let carList = []
                    for (let key in data) {
                        let obj = {
                            name: data[key],
                            value: key
                        }
                        carList.push(obj)
                    }
                    this.carList = carList
                }
            })
                .catch(res => {
                    this.$Spin.hide();
                    // this.$Message.warning("服务端异常")
                })
        },
        // 获取线路列表
        getRouteList() {
            this.$fetch(`/admin/index/select-route`).then(res => {
                this.$Spin.hide();
                if (res.code === 200) {
                    if (res.data) {
                        let data = res.data
                        let routeList = []
                        for (let key in data) {
                            let obj = {
                                name: data[key],
                                value: key
                            }
                            routeList.push(obj)
                        }
                        this.routeList = routeList
                    }
                } else {
                    this.$Message.warning(res.error)
                }
            })
                .catch(res => {
                    this.$Spin.hide();
                    // this.$Message.warning("服务端异常")
                })
        },
        //页码
        changePage(e) {
            this.page = e;
            this.getTimerList("page");
        }
    },

}