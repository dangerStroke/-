import { Layout } from "iview"

export default {
    name: "addFlights",
    data() {
        return {
            timerType: 1, // 循环类型
            routeList: [],
            routeId: "",
            carList: [],
            carId: "",
            carInfo: {},
            driverInfo: {},
            startArr: [],
            endArr: [],
            weeks: [{
                label: "周一",
                value: "Monday",
                checked: false
            }, {
                label: "周二",
                value: "Tuesday",
                checked: false
            }, {
                label: "周三",
                value: "Wednesday",
                checked: false
            }, {
                label: "周四",
                value: "Thursday",
                checked: false
            }, {
                label: "周五",
                value: "Friday",
                checked: false
            }, {
                label: "周六",
                value: "Saturday",
                checked: false
            }, {
                label: "周日",
                value: "Sunday",
                checked: false
            },],
            weeksInfo: [
                {
                    weekName: "Monday",
                    startArr: [],
                    endArr: []
                },
                {
                    weekName: "Tuesday",
                    startArr: [],
                    endArr: []
                },
                {
                    weekName: "Wednesday",
                    startArr: [],
                    endArr: []
                },
                {
                    weekName: "Thursday",
                    startArr: [],
                    endArr: []
                },
                {
                    weekName: "Friday",
                    startArr: [],
                    endArr: []
                },
                {
                    weekName: "Saturday",
                    startArr: [],
                    endArr: []
                },
                {
                    weekName: "Sunday",
                    startArr: [],
                    endArr: []
                },
            ],
            dateArray: [],
            dateStart: [],
            dateEnd: []
        }
    },
    watch: {
        carId() {
            this.carList.map(item => {
                if (this.carId === item.id) {
                    this.carInfo = item
                }
            })
        },
        // weeksInfo: {
        //     handler(newVal,oldVal) {
        //         console.log("value改变")
        //         console.log(newVal)
        //         console.log(oldVal)
        //     },
        //     deep: true
        // }
    },
    created() {
        this.getRouteList()
        this.getPickupTime("7:00", "start_pick_up_time")
    },
    methods: {
        // 选择时间段
        dateChange (e) {
            console.log(e)
            this.dateArray = e
        },
        // 保存时间班次
        saveDateTimer () {
            console.log(this.dateArray)
            if (!this.routeId) {
                this.$Message.warning("请选择路线")
                return
            }
            if (!this.carId) {
                this.$Message.warning("请选择车辆")
                return
            }
            if (this.dateArray.length === 0) {
                this.$Message.warning("请选择起始日期")
                return
            }
            let startArr = []
            let endArr = []
            this.dateStart.map(item => {
                if (item.timer) {
                    let timerId = this.getRandomStr(false,6)
                    let obj = {
                        [timerId]:item.timer
                    }
                    startArr.push(obj)
                }
            })
            this.dateEnd.map(item => {
                if (item.timer) {
                    let timerId = this.getRandomStr(false,6)
                    let obj = {
                        [timerId]:item.timer
                    }
                    endArr.push(obj)
                }
            })
            let start = Array.from(new Set(startArr))
            let end = Array.from(new Set(endArr))
            if (start.length < startArr.length || end.length < endArr.length) {
                this.$Message.warning("班次不可选择相同时间")
                return
            }
            if (start.length === 0 && end.length === 0) {
                this.$Message.warning("请填写班次信息")
                return
            }
            let params = {
                route_id: this.routeId,
                timer: {
                    [this.carId]: {
                        start: this.carInfo.start,
                        end: this.carInfo.end,
                        start_time: this.dateArray[0],
                        end_time: this.dateArray[1],
                        timer: {
                            start,
                            end
                        }
                    }
                }
            }
            console.log(123)
            console.log(params)
            this.$post(`admin/classes/add-date`, params).then(res => {
                this.$Spin.hide();
                if (res.code === 200) {
                    if (res.data) {
                        this.$Message.success("添加成功")
                        this.$router.push({
                            name: "flightsList"
                        })
                    } else {
                        this.$Message.warning("添加失败")
                    }
                } else {
                    this.$Message.warning(res.error)
                }
            })
            .catch(res => {
            })
        },
        // 保存周数据
        saveWeeksTimer () {
            let params = {
                route_id: this.routeId,
                timer: {
                    [this.carId]: {
                        start: this.carInfo.start,
                        end: this.carInfo.end,
                        timer: {
                            Monday:{},
                            Tuesday: {},
                            Wednesday: {},
                            Thursday: {},
                            Friday: {},
                            Saturday: {},
                            Sunday: {}
                        }
                    }
                }
            }
            if (!this.routeId) {
                this.$Message.warning("请选择路线")
                return
            }
            if (!this.carId) {
                this.$Message.warning("请选择车辆")
                return
            }
            for (let i=0;i<this.weeksInfo.length;i++) {
                let item = this.weeksInfo[i]
                let startArr = []
                let endArr = []
                item.startArr.map(start => {
                    if (start.timer) {
                        startArr.push(start.timer)
                    }
                })
                item.endArr.map(end => {
                    if (end.timer) {
                        endArr.push(end.timer)
                    }
                })
                let start = Array.from(new Set(startArr))
                let end = Array.from(new Set(endArr))
                if (start.length < startArr.length || end.length < endArr.length) {
                    this.$Message.warning("班次不可选择相同时间")
                    return
                }
                let startTimer = []
                let endTimer = []
                start.map(item => {
                    let timerId = this.getRandomStr(false,6)
                    let obj = {
                        [timerId]:item
                    }
                    startTimer.push(obj)
                })
                end.map(item => {
                    let timerId = this.getRandomStr(false,6)
                    let obj = {
                        [timerId]:item
                    }
                    endTimer.push(obj)
                })
                params.timer[this.carId].timer[item.weekName].start = startTimer 
                params.timer[this.carId].timer[item.weekName].end = endTimer
                // if (item.startArr.length === 0 && item.endArr.length === 0) {
                //     this.$Message.warning("请填写完整的班次信息")
                //     return
                // } else {
                //     let startArr = []
                //     let endArr = []
                //     item.startArr.map(start => {
                //         if (start.timer) {
                //             startArr.push(start.timer)
                //         }
                //     })
                //     item.endArr.map(end => {
                //         if (end.timer) {
                //             endArr.push(end.timer)
                //         }
                //     })
                //     let start = Array.from(new Set(startArr))
                //     let end = Array.from(new Set(endArr))
                //     if (start.length < startArr.length || end.length < endArr.length) {
                //         this.$Message.warning("班次不可选择相同时间")
                //         return
                //     }
                //     let startTimer = []
                //     let endTimer = []
                //     start.map(item => {
                //         let timerId = this.getRandomStr(false,6)
                //         let obj = {
                //             [timerId]:item
                //         }
                //         startTimer.push(obj)
                //     })
                //     end.map(item => {
                //         let timerId = this.getRandomStr(false,6)
                //         let obj = {
                //             [timerId]:item
                //         }
                //         endTimer.push(obj)
                //     })
                //     params.timer[this.carId].timer[item.weekName].start = startTimer 
                //     params.timer[this.carId].timer[item.weekName].end = endTimer
                // }
            }
            this.$post(`/admin/classes/add-week`,params).then(res => {
                if (res.code === 200) {
                    if (res.data) {
                        this.$Message.success("添加成功")
                        this.$router.push({
                            name: "flightsList"
                        })
                    } else {
                        this.$Message.warning("添加失败")
                    }
                } else {
                    this.$Message.warning(res.error)
                }
            }).catch(res => {
                // this.$Message.warning("服务端异常")
            })
        },
        // // 周选择事件
        // weeksChange (e,index) {
        // },
        // 生成随机字符串
        getRandomStr(randomFlag, min, max) {
            let str = "",
                range = min,
                arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
            // 随机产生
            if (randomFlag) {
                range = Math.round(Math.random() * (max - min)) + min;
            }
            for (var i = 0; i < range; i++) {
                let pos = Math.round(Math.random() * (arr.length - 1));
                str += arr[pos];
            }
            return str;
        },
        // 保存班次配置
        saveTimer() {
            if (!this.routeId) {
                this.$Message.warning("请选择路线")
                return
            }
            if (!this.carId) {
                this.$Message.warning("请选择车辆")
                return
            }
            let startArr = []
            let endArr = []
            this.startArr.map(item => {
                if (item.timer) {
                    startArr.push(item.timer)
                }
            })
            this.endArr.map(item => {
                if (item.timer) {
                    endArr.push(item.timer)
                }
            })
            let start = Array.from(new Set(startArr))
            let end = Array.from(new Set(endArr))
            if (start.length < startArr.length || end.length < endArr.length) {
                this.$Message.warning("班次不可选择相同时间")
                return
            }
            if (start.length === 0 && end.length === 0) {
                this.$Message.warning("请填写班次信息")
                return
            }
            let startParams = []
            let endParams = []
            start.map(item => {
                let timerId = this.getRandomStr(false,6)
                let obj = {
                    [timerId]: item
                }
                startParams.push(obj)
            })
            end.map(item => {
                let timerId = this.getRandomStr(false,6)
                let obj = {
                    [timerId]: item
                }
                endParams.push(obj)
            })
            let params = {
                route_id: this.routeId,
                timer: {
                    [this.carId]: {
                        start: this.carInfo.start,
                        end: this.carInfo.end,
                        timer: {
                            start: startParams,
                            end:endParams
                        }
                    }
                }
            }
            this.$post(`admin/classes/add`, params).then(res => {
                this.$Spin.hide();
                if (res.code === 200) {
                    if (res.data) {
                        this.$Message.success("添加成功")
                        this.$router.push({
                            name: "flightsList"
                        })
                    } else {
                        this.$Message.warning("添加失败")
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
        // 按天循环选择时间
        timeChange(e, item, index, type) {
            if (type === "startArr" || type === "dateStart") {
                item.pickupTime = this.getPickupTime(item.timer, "start_pick_up_time")
            } else {
                item.pickupTime = this.getPickupTime(item.timer, "end_pick_up_time")
            }
            this.$set(this[type], index, item)
        },
        // 按周循环选择时间
        weekTimeChange(e, item, index,timer,timerIndex, type) {
            if (type === "startArr") {
                timer.pickupTime = this.getPickupTime(timer.timer, "start_pick_up_time")
            } else {
                timer.pickupTime = this.getPickupTime(timer.timer, "end_pick_up_time")
            }
            this.$set(this.weeksInfo,index,item)
        },
        // 计算接送时间
        getPickupTime(time, type) {
            let timeStr = "1970-12-01 " + time
            let date = new Date(timeStr)
            let subSeconds = date.getTime() - this.carInfo[type] * 1000
            let newDate = new Date(subSeconds)
            let hour = newDate.getHours()
            let minute = newDate.getMinutes()
            let seconds = newDate.getSeconds()
            if (hour < 10) {
                hour = `0${hour}`
            }
            if (minute < 10) {
                minute = `0${minute}`
            }
            if (seconds < 10) {
                seconds = `0${seconds}`
            }
            let pickupTime = [hour, minute].join(":")
            return pickupTime
        },
        // 删除按周循环班次
        deleteWeeksFlights(type,item,index,timer,timerIndex) {
            this.weeksInfo[index][type].splice(timerIndex,1)
        },
        // 删除按天循环班次 
        deleteFlights(type, index) {
            this[type].splice(index, 1)
        },
        // 新增班次
        addFlights(type,index,name) {
            if (!this.carId) {
                this.$Message.warning("请先选择车辆")
                return
            }
            if (name === "day") {
                let obj = {
                    timer: ""
                }
                this[type].push(obj)
            }
            if (name === "week") {
                // let key = this.getRandomStr(false,6)
                let obj = {
                    timer: ""
                }
                this.weeksInfo[index][type].push(obj)
            }
        },
        // 获取线路列表
        getRouteList() {
            this.$fetch(`/admin/index/select-route`).then(res => {
                this.$Spin.hide();
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
            })
                .catch(res => {
                    this.$Spin.hide();
                    // this.$Message.warning("服务端异常")
                })
        },
        // 获取车辆列表
        getCarList() {
            this.$fetch(`admin/classes/get-car-station-route-map?route_id=${this.routeId}`).then(res => {
                if (res.code === 200) {
                    if (res.data.length > 0) {
                        this.carList = res.data
                    }
                } else {
                    this.$Message.warning(res.error)
                }
            })
            .catch(res => {
                // this.$Message.warning("服务端异常")
            })
        },
    },
}