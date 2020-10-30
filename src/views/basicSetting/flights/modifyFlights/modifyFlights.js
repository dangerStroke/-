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
                    label: "周一",
                    weekName: "Monday",
                    startArr: [],
                    endArr: []
                },
                {
                    label: "周二",
                    weekName: "Tuesday",
                    startArr: [],
                    endArr: []
                },
                {
                    label: "周三",
                    weekName: "Wednesday",
                    startArr: [],
                    endArr: []
                },
                {
                    label: "周四",
                    weekName: "Thursday",
                    startArr: [],
                    endArr: []
                },
                {
                    label: "周五",
                    weekName: "Friday",
                    startArr: [],
                    endArr: []
                },
                {
                    label: "周六",
                    weekName: "Saturday",
                    startArr: [],
                    endArr: []
                },
                {
                    label: "周日",
                    weekName: "Sunday",
                    startArr: [],
                    endArr: []
                },
            ],
            dateArray: [],
            dateStart: [],
            dateEnd: [],
            type: "",
            detailInfo: {},
        }
    },
    watch: {
        carId() {
            console.log(this.carId)
            console.log(this.carList)
            // this.carList.map(item => {
            //     if (this.carId === item.id) {
            //         this.carInfo = item
            //     }
            // })
        },
    },
    created() {
        this.routeId = Number(this.$route.query.route_id)
        this.carId = Number(this.$route.query.car_id)
        this.type = this.$route.query.type
        this.getCarList()

    },
    methods: {
        // 取消修改操作
        cancleModify() {
            this.$router.push({
                name: "flightsList"
            })
        },
        // 获取班次信息
        getTimerInfo(route_id, car_id) {
            this.$fetch(`admin/classes/get?route_id=${route_id}&car_id=${car_id}`).then(res => {
                if (res.code === 200) {
                    if (res.data) {
                        let data = res.data
                        this.detailInfo = data
                        this.timerType = data.type
                        let timerInfo = {}
                        if (data.date.start) {
                            timerInfo = data.date
                            this.formatDateTimer(timerInfo)
                        }
                        if (data.week.start) {
                            timerInfo = data.week
                            this.formatWeekTimer(timerInfo)

                        }
                        if (data.day.start) {
                            timerInfo = data.day
                            this.formatDayTimer(timerInfo)

                        }
                        // this.carInfo.start = timerInfo.start
                        // this.carInfo.end = timerInfo.end
                    }
                } else {
                    this.$Message.warning(res.error)
                }
            })
        },
        // 格式化按天循环数据
        formatDayTimer(timerInfo) {
            this.startArr = this.formatData(timerInfo.timer.start, "start_pick_up_time")
            this.endArr = this.formatData(timerInfo.timer.end, "end_pick_up_time")
        },
        // 格式化按日期循环数据
        formatDateTimer(timerInfo) {
            this.dateArray[0] = timerInfo.start_time
            this.dateArray[1] = timerInfo.end_time
            this.dateStart = this.formatData(timerInfo.timer.start, "start_pick_up_time")
            this.dateEnd = this.formatData(timerInfo.timer.end, "end_pick_up_time")
        },
        // 格式化按周循环数据
        formatWeekTimer(timerInfo) {
            let that = this
            let timerArr = timerInfo.timer
            let weeksInfo = []
            for (let key in timerArr) {
                let singleWeek = {
                    weekName: key,
                    startArr: [],
                    endArr: []
                }
                this.weeks.map(item => {
                    if (key === item.value) {
                        singleWeek.label = item.label
                    }
                })
                singleWeek.startArr = that.formatData(timerArr[key].start, "start_pick_up_time")
                singleWeek.endArr = that.formatData(timerArr[key].end, "end_pick_up_time")
                weeksInfo.push(singleWeek)
            }
            this.weeksInfo = weeksInfo
        },
        formatData(data, type) {
            let that = this
            let result = []
            data.map(item => {
                for (let key in item) {
                    let obj = {
                        timer: item[key],
                        id: key,
                        pickupTime: that.getPickupTime(item[key], type)
                    }
                    result.push(obj)
                }
            })
            return result
        },
        // 选择时间段
        dateChange(e) {
            this.dateArray = e
        },
        // 保存时间班次
        saveDateTimer() {
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
                    let obj = {}
                    let timerId = ""
                    if (!item.id) {
                        timerId = this.getRandomStr(false, 6)
                        obj = {
                            [timerId]: item.timer
                        }
                    } else {
                        obj = {
                            [item.id]: item.timer
                        }
                    }
                    startArr.push(obj)
                }
            })
            this.dateEnd.map(item => {
                if (item.timer) {
                    let obj = {}
                    let timerId = ""
                    if (!item.id) {
                        timerId = this.getRandomStr(false, 6)
                        obj = {
                            [timerId]: item.timer
                        }
                    } else {
                        obj = {
                            [item.id]: item.timer
                        }
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
            console.log(params)
            this.$post(`admin/classes/edit-date`, params).then(res => {
                this.$Spin.hide();
                if (res.code === 200) {
                    if (res.data) {
                        this.$Message.success("修改成功")
                        this.getCarList()
                    } else {
                        this.$Message.warning("修改失败")
                    }
                } else {
                    this.$Message.warning(res.error)
                }
            })
                .catch(res => {
                })
        },
        // 保存周数据
        saveWeeksTimer() {
            let params = {
                route_id: this.routeId,
                timer: {
                    [this.carId]: {
                        start: this.carInfo.start,
                        end: this.carInfo.end,
                        timer: {
                            Monday: {},
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
            for (let i = 0; i < this.weeksInfo.length; i++) {
                let item = this.weeksInfo[i]
                let startArr = item.startArr.reduce(function (prev, element) {
                    if (!prev.find(el => el.timer == element.timer)) {
                        prev.push(element)
                    }
                    return prev
                }, [])
                let endArr = item.endArr.reduce(function (prev, element) {
                    if (!prev.find(el => el.timer == element.timer)) {
                        prev.push(element)
                    }
                    return prev
                }, [])
                if (startArr.length < item.startArr.length || endArr.length < item.endArr.length) {
                    this.$Message.warning("班次不可选择相同时间")
                    return
                }
                let startTimer = []
                let endTimer = []
                startArr.map(item => {
                    let timerId = ""
                    let obj = {}
                    if (!item.id) {
                        timerId = this.getRandomStr(false, 6)
                        obj = {
                            [timerId]: item.timer
                        }
                    } else {
                        obj = {
                            [item.id]: item.timer
                        }
                    }
                    startTimer.push(obj)
                })
                endArr.map(item => {
                    let timerId = ""
                    let obj = {}
                    if (!item.id) {
                        timerId = this.getRandomStr(false, 6)
                        obj = {
                            [timerId]: item.timer
                        }
                    } else {
                        obj = {
                            [item.id]: item.timer
                        }
                    }
                    endTimer.push(obj)
                })
                params.timer[this.carId].timer[item.weekName].start = startTimer
                params.timer[this.carId].timer[item.weekName].end = endTimer
                // if (item.startArr.length === 0 && item.endArr.length === 0) {
                //     this.$Message.warning("请填写完整的班次信息")
                //     return
                // } else {
                //     let startArr = item.startArr.reduce(function (prev, element) {
                //         if (!prev.find(el => el.timer == element.timer)) {
                //             prev.push(element)
                //         }
                //         return prev
                //     }, [])
                //     let endArr = item.endArr.reduce(function (prev, element) {
                //         if (!prev.find(el => el.timer == element.timer)) {
                //             prev.push(element)
                //         }
                //         return prev
                //     }, [])
                //     if (startArr.length < item.startArr.length || endArr.length < item.endArr.length) {
                //         this.$Message.warning("班次不可选择相同时间")
                //         return
                //     }
                //     let startTimer = []
                //     let endTimer = []
                //     startArr.map(item => {
                //         let timerId = ""
                //         let obj = {}
                //         if (!item.id) {
                //             timerId = this.getRandomStr(false, 6)
                //             obj = {
                //                 [timerId]: item.timer
                //             }
                //         } else {
                //             obj = {
                //                 [item.id]: item.timer
                //             }
                //         }
                //         startTimer.push(obj)
                //     })
                //     endArr.map(item => {
                //         let timerId = ""
                //         let obj = {}
                //         if (!item.id) {
                //             timerId = this.getRandomStr(false, 6)
                //             obj = {
                //                 [timerId]: item.timer
                //             }
                //         } else {
                //             obj = {
                //                 [item.id]: item.timer
                //             }
                //         }
                //         endTimer.push(obj)
                //     })
                //     params.timer[this.carId].timer[item.weekName].start = startTimer
                //     params.timer[this.carId].timer[item.weekName].end = endTimer
                // }
            }
            this.$post(`/admin/classes/edit-week`, params).then(res => {
                if (res.code === 200) {
                    if (res.data) {
                        this.$Message.success("修改成功")
                        this.getCarList()
                    } else {
                        this.$Message.warning("修改失败")
                    }
                } else {
                    this.$Message.warning(res.error)
                }
            }).catch(res => {
                // this.$Message.warning("服务端异常")
            })
        },
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
            let start = this.startArr.reduce(function (prev, element) {
                if (!prev.find(el => el.timer == element.timer)) {
                    prev.push(element)
                }
                return prev
            }, [])
            let end = this.endArr.reduce(function (prev, element) {
                if (!prev.find(el => el.timer == element.timer)) {
                    prev.push(element)
                }
                return prev
            }, [])
            if (start.length < this.startArr.length || end.length < this.endArr.length) {
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
                let timerId = ""
                let obj = {}
                if (!item.id) {
                    timerId = this.getRandomStr(false, 6)
                    obj = {
                        [timerId]: item.timer
                    }
                } else {
                    obj = {
                        [item.id]: item.timer
                    }
                }
                startParams.push(obj)
            })
            end.map(item => {
                let timerId = ""
                let obj = {}
                if (!item.id) {
                    timerId = this.getRandomStr(false, 6)
                    obj = {
                        [timerId]: item.timer
                    }
                } else {
                    obj = {
                        [item.id]: item.timer
                    }
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
                            end: endParams
                        }
                    }
                }
            }
            this.$post(`admin/classes/edit`, params).then(res => {
                this.$Spin.hide();
                if (res.code === 200) {
                    if (res.data) {
                        this.$Message.success("修改成功")
                        this.getCarList()
                    } else {
                        this.$Message.warning("修改失败")
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
        weekTimeChange(e, item, index, timer, timerIndex, type) {
            if (type === "startArr") {
                timer.pickupTime = this.getPickupTime(timer.timer, "start_pick_up_time")
            } else {
                timer.pickupTime = this.getPickupTime(timer.timer, "end_pick_up_time")
            }
            this.$set(this.weeksInfo, index, item)
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
        deleteWeeksFlights(type, item, index, timer, timerIndex) {
            this.weeksInfo[index][type].splice(timerIndex, 1)
        },
        // 删除按天循环班次 
        deleteFlights(type, index) {
            this[type].splice(index, 1)
        },
        // 新增班次
        addFlights(type, index, name) {
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
            this.$fetch(`admin/index/select-route`).then(res => {
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
                this.$Spin.hide();
                if (res.code === 200) {
                    if (res.data.length > 0) {
                        this.carList = res.data
                        this.carList.map(item => {
                            if (this.carId === item.id) {
                                this.carInfo = item
                            }
                        })
                        this.getTimerInfo(this.routeId, this.carId)
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